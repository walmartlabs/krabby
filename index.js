#!/usr/bin/env node

var async = require('async');
var Path = require('path');
var _ = require('lodash');
var FS = require('fs');
var parentDir;
var reports;
var tests;
var config;
var pkg;

var argv = require('yargs')
  .alias('c', 'config')
  .argv;

if (!argv.config) {

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

if (argv.config) {
  config = require(Path.resolve(argv.config));

  if (config.krabby) {
    config = config.krabby;
  }
} else if (FS.existsSync(Path.join(parentDir, 'krabby.json'))) {
  config = require(Path.join(parentDir, 'krabby.json'));
} else if (pkg.krabby) {
  config = pkg.krabby;
}

if (!config) {
  throw new Error('no krabby config found. what do you expect to happen?');
} else if (!config.tests) {
  throw new Error('you did\'t define any krabby tests. great job.');
} else if (!config.reports) {
  throw new Error('you did\'t define any krabby reports. great job.');
}

tests = config.tests.map(function(test) {
  var testName;
  var config = {};

  if (typeof test === 'string') {
    testName = test;
  } else {
    testName = test.name;
    config = test;
  }

  var Test = require(Path.join(__dirname, 'lib/tests', testName));
  test = new Test(config);

  return test.test.bind(test);
});

reports = config.reports.map(function(report) {
  var reportName;
  var config = {};

  if (typeof report === 'string') {
    reportName = report;
  } else {
    reportName = report.name;
    config = report;
  }

  Report = require(Path.join(__dirname, 'lib/reports', reportName));
  report = new Report(config);

  return report.report.bind(report);
});


var test = function(cb) {
  async.parallel(tests, function(err, results) {
    cb.apply(this, arguments);
  });
};


var report = function() {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();

  // curry the reporters so they get a consistent argument signature
  reports = reports.map(function(report) {
    return function() {
      report.call(report, _.flatten(args), cb);
    };
  });

  async.parallel(reports, function(err, results) {
    cb.apply(this, arguments);
  });
};

async.waterfall([test, report], function(result) {
  console.log(result);
});
