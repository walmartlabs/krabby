var glob = require('globby');
var isGlob = require('is-glob');
var _ = require('lodash');

function _BaseKeabbyPlugin(baseConfig) {

  var krabbyPlugin = function(config) {
    this.config = _.extend(baseConfig, config);
    this.score = undefined;
    this.weight = 1;

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

  krabbyPlugin.prototype.test = function() {
    throw new Error('no test defined for plugin');
  };

  krabbyPlugin.prototype.grade = function() {
    throw new Error('no grader defined for plugin');
  };

  return krabbyPlugin;

}

module.exports = _BaseKeabbyPlugin;
