var _ = require('lodash');
var CoverageExcludes = require('../../../../lib/tests/coverageExcludes.js');
var BaseTest = require('../../../../lib/tests/_baseTest.js')();

var noCoverageExcludes = {};
var oneCoverageExclude = {
  coverageExcludes: {
    "USFEITEM-2503": [
      "test/test.js"
    ]
  }
};
var tenCoverageExclude = {
  coverageExcludes: {
    "USFEITEM-2503": [
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js",
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js"
    ]
  }
};
var thirteenCoverageExclude = {
  coverageExcludes: {
    "USFEITEM-2503": [
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js",
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js",
      "test/test.js", "test/test.js", "test/test.js"
    ]
  }
};
var twentyCoverageExclude = {
  coverageExcludes: {
    "USFEITEM-2503": [
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js",
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js",
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js",
      "test/test.js", "test/test.js", "test/test.js", "test/test.js", "test/test.js"
    ]
  }
};

describe("tests/coverageExcludes.js", function () {
  describe('gradeResults', function() {
    it('grades repo with no excludes as 1', function() {
      var coverageExcludes = new CoverageExcludes();
      var grade = coverageExcludes.gradeResults({});
      assert(grade === 1);
    });

    it('grades repo with 1 exclude above 80%', function() {
      var coverageExcludes = new CoverageExcludes();
      var grade = coverageExcludes.gradeResults(oneCoverageExclude.coverageExcludes);
      assert(grade > .90);
    });

    it('grades repo with 10 exclude below 30%', function() {
      var coverageExcludes = new CoverageExcludes();
      var grade = coverageExcludes.gradeResults(tenCoverageExclude.coverageExcludes);
      assert(grade < .30);
    });

    it('grades repo with 13 excludes at 0%', function() {
      var coverageExcludes = new CoverageExcludes();
      var grade = coverageExcludes.gradeResults(thirteenCoverageExclude.coverageExcludes);
      assert(grade === 0);
    });

    it('grades repo with more than 13 excludes at 0%', function() {
      var coverageExcludes = new CoverageExcludes();
      var grade = coverageExcludes.gradeResults(twentyCoverageExclude.coverageExcludes);
      assert(grade === 0);
    });
  });
  describe('test', function() {
    var sandbox;

    beforeEach(function () {
      sandbox = sinon.sandbox.create();
      sandbox.stub(CoverageExcludes.prototype, 'getConfig').returns(noCoverageExcludes);
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should call the callback with an instance of _baseTest');
    it('should set the grade property with a grade');
    it('should set the logs.logs property with the full result');
    it('should set the logs.debug property with any errors');
  });
});
