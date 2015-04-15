var glob = require('globby');
var isGlob = require('is-glob');
var _ = require('lodash');

function _BaseKeabbyTest(baseConfig) {

  var krabbyTest = function(config) {
    this.config = _.extend(baseConfig, config);
    this.grade = 1;

    this.logs = {
      errors: [],
      warnings: [],
      logs: [],
      debug: []
    };

    if (this.config.files && this.config.files.some(isGlob)) {
      this.config.files = glob.sync(this.config.files, {nodir: true});
    }
  };

  krabbyTest.prototype.test = function() {
    throw new Error('no test defined for test');
  };

  return krabbyTest;

}

module.exports = _BaseKeabbyTest;
