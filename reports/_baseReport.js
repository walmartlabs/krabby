var _ = require('lodash');

function _BaseKeabbyReporter(baseConfig, reporter) {

  var krabbyReporter = function(config) {
    var args = Array.prototype.slice.call(arguments);
    this.config = _.extend({}, baseConfig, config);

    return reporter;
  };

  return krabbyReporter;
}

module.exports =  _BaseKeabbyReporter;
