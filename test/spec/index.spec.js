var _ = require('lodash');
var krabby = require('../../index.js');
var JsHint = require('../../lib/testers/jshint.js');

describe('index.js', function() {
  describe('_getOptions', function() {
    it('returns a config Object identical to any valid one passed in', function() {
      var options = {
        tests: [],
        reports: [],
        'extra-option': true
      };

      var parsedOptions = krabby._getOptions(options);
      assert(_.isEqual(options, parsedOptions));
    });
    it('throws an Error if config doesn\'t define an Array of tests', function() {
      var options = {
        reports: []
      };

      var threwError = false;
      try {
        krabby._getOptions(options);
      } catch (e) {
        threwError = true;
        assert(Error.message = 'you did\'t define any krabby tests. great job.');
      }
      assert(threwError);
    });
    it('throws an Error if config doesn\'t define an Array of reports', function() {
      var options = {
        tests: []
      };

      var threwError = false;
      try {
        krabby._getOptions(options);
      } catch (e) {
        threwError = true;
        assert(Error.message = 'you did\'t define any krabby reports. great job.');
      }
      assert(threwError);
    });
  });
  describe('_instantiatePlugins', function() {
    it('returns an Array of instantiated plugins', function() {
      var tests = krabby._instantiatePlugins(['jshint'], 'lib/testers');

      assert(_.isArray(tests));
      assert(tests[0] instanceof JsHint);
    });
  });
  describe('_test', function() {
    it('executes each test that is passed in');
    it('calls the callback after each test is executed');
  });
  describe('_report', function() {
    it('executes each report that is passed in');
    it('calls the callback after each test is executed');
  });
});
