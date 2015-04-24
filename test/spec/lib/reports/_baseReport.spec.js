var _ = require('lodash');
var _baseReport = require('../../../../lib/reports/_baseReport.js');

describe("tests/_baseReport", function () {
  describe('configuration', function() {
    it('should create a config property when no config is passed in', function() {
      var FakeReporter = _baseReport();
      var fakeReporter = new FakeReporter();

      assert(_.isEqual(fakeReporter.config, {}));
    });
    it('should create a config property when only runtimeConfig is passed in', function() {
      var runtimeTestConfig = { runtime: true };

      var FakeReporter = _baseReport();
      var fakeReporter = new FakeReporter(runtimeTestConfig);

      assert(_.isEqual(fakeReporter.config, runtimeTestConfig));
    });
    it('should create a config property when only baseConfig is passed in', function() {
      var baseTestConfig = { base: true };

      var FakeReporter = _baseReport(baseTestConfig);
      var fakeReporter = new FakeReporter();

      assert(_.isEqual(fakeReporter.config, baseTestConfig));
    });
    it('should not modify the config objects', function() {
      var baseTestConfig = {
        base: true,
        deep: {
          common: "base",
          bass: true
        }
      };
      var runtimeTestConfig = {
        runtime: true,
        deep: {
          common: "runtime",
          runtime: true
        }
      };
      var baseTestConfigCopy = JSON.parse(JSON.stringify(baseTestConfig));
      var runtimeTestConfigCopy = JSON.parse(JSON.stringify(runtimeTestConfig));

      var FakeReporter = _baseReport(baseTestConfig);
      var fakeReporter = new FakeReporter(runtimeTestConfig);

      assert(_.isEqual(baseTestConfig, baseTestConfigCopy));
      assert(_.isEqual(runtimeTestConfig, runtimeTestConfigCopy));
    });
    it('should contain unique (deep) values from both dictionaries', function() {
      var baseTestConfig = {
        base: true,
        deep: {
          common: "base",
          bass: true
        }
      };
      var runtimeTestConfig = {
        runtime: true,
        deep: {
          common: "runtime",
          runtime: true
        }
      };

      var FakeReporter = _baseReport(baseTestConfig);
      var fakeReporter = new FakeReporter(runtimeTestConfig);

      assert(fakeReporter.config.deep.common === "runtime");
      assert(fakeReporter.config.deep.bass === true);
      assert(fakeReporter.config.deep.runtime === true);
    });
  });
});
