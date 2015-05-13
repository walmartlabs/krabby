var async = require('async');
var Path = require('path');
var _ = require('lodash');
var FS = require('fs');

var getOptions = function(options) {
  var parentDir;
  var pkg;
  var config;

  // If no config is passed in find the project root
  if (_.isEmpty(options)) {
    if (FS.existsSync('package.json')) {
      parentDir = process.cwd();
    } else {
      parentDir = require('find-parent-dir').sync(process.cwd(), 'package.json');
    }

    if (!parentDir) {
      throw new Error('can\'t find the root of the project. go find a package.json file');
    }

    pkg = require(Path.join(parentDir, 'package.json'));
  }

  if (!_.isEmpty(options)) {
    config = options;

    if (config.krabby) {
      config = config.krabby;
    }
  } else if (FS.existsSync(Path.join(parentDir, 'krabby.json'))) {
    config = require(Path.join(parentDir, 'krabby.json'));
  } else if (pkg.krabby) {
    config = pkg.krabby;
  }

  if (_.isEmpty(config)) {
    throw new Error('no krabby config found. what do you expect to happen?');
  } else if (!_.isArray(config.tests)) {
    throw new Error('you did\'t define any krabby tests. great job.');
  } else if (!_.isArray(config.reports)) {
    throw new Error('you did\'t define any krabby reports. great job.');
  }

  return config;
}

var instantiatePlugins = function(plugins, path) {
  return plugins.map(function(plugin) {
    var pluginConfig = _.isString(plugin) ? { name: plugin } : plugin;

    var Plugin = require(Path.join(__dirname, path, pluginConfig.name));
    return new Plugin(pluginConfig);
  });
}

var test = function(tests, cb) {
  var testFunctions = tests.map(function(test) { return test.test.bind(test); });
  async.parallel(testFunctions, function(err, results) {
    cb.apply(this, arguments);
  });
};

var report = function(reports) {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();

  // curry the reporters so they get a consistent argument signature
  var reportFunctions = reports.map(function(report) { return report.report.bind(report); });
  reports = reportFunctions.map(function(report) {
    return function() {
      report.call(report, _.flatten(args), cb);
    };
  });

  async.parallel(reports, function(err, results) {
    cb.apply(this, arguments);
  });
};

var run = function(options) {
  var config = getOptions(options);
  var tests = instantiatePlugins(config.tests, 'lib/tests');
  var reports = instantiatePlugins(config.reports, 'lib/reports');

  async.waterfall([_.partial(test, tests), _.partial(report, reports)], function(result) {
    console.log(result);
  });
};

module.exports = _.extend(run, {
  _getOptions: getOptions,
  _instantiatePlugins: instantiatePlugins,
  _test: test,
  _report: report
});
