var krabbyTest = require('./_baseTest');
var jshint = require('jshint').JSHINT;
var Async = require('async');
var FS = require('fs');

var baseConfig = {
  testConfig: {
  },
  files: ['./**/*.js', '!./node_modules/**/*.js', '!./**/node_modules/**/*.js']
};

var JSHintTest = new krabbyTest(baseConfig);

JSHintTest.prototype.lint = function(file, cb) {
  var self = this;

  FS.readFile(file, function(err, data) {
    if (err) {
      return cb(err);
    }

    var result = jshint(data.toString(), self.config.testConfig);

    if (!result) {

      self.logs.errors.push({
        file: file,
        errors: jshint.errors
      });
    }

    cb(null, result);
  });
};

JSHintTest.prototype.test = function(cb) {
  var self = this;
  var tests = this.config.files.map(function(file) {

    return function(cb) {
      self.lint(file, cb);
    }.bind(self);
  });

  Async.parallel(tests, function(err, results) {
    self.process.call(self, results, cb);
  });
};

JSHintTest.prototype.process = function(results, cb) {
  // lets be optimistic...
  var grade = 1;

  if (results.logs.errors.length > 0) {
    // automatic F for failures, but at least they aren't failing so badly we
    // have to actually give up
    grade = Math.min(grade, 0.5);
  }

  var tooMany = results.logs.errors.some(function(errs) {
    return errs.errors.some(function(err) {
      // E043 === "too many errors"
      return err && err.code === 'E043';
    });
  });

  if (tooMany) {
    // oh - they are fialing that bad? Ok. Goose egg it is
    grade = 0;
  }

  results.grade = grade;
  cb(null, results);
};

module.exports = JSHintTest;
