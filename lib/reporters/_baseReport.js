var _ = require('lodash');

function _BaseKeabbyReporter(baseConfig, reporter) {

  var krabbyReporter = function(config) {
    this.config = _.merge({}, baseConfig, config);
  };

  krabbyReporter.prototype.report = function() {
    throw new Error('no report defined for test');
  };

  return krabbyReporter;
}

module.exports =  _BaseKeabbyReporter;
