'use strict';

var krabbyTest = require('./_baseTest');
var escomplex = require('escomplex-js');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));

var baseConfig = {
  testConfig: {
  },
  files: ['./**/*.js', '!./node_modules/**/*.js', '!./**/node_modules/**/*.js']
};

var ComplexityTest = new krabbyTest(baseConfig);

ComplexityTest.prototype.analyze = function(files) {
  var testConfig = this.config.testConfig;

  return Promise.map(files, function(fileName) {
    return fs.readFileAsync(fileName)
      .then(function(data) {
        return escomplex.analyse(data.toString(), testConfig);
      })
      .catch(function(e) {
        e.fileName = fileName;
        return e;
      });
  });
};

ComplexityTest.prototype.process = function(rawResults) {
  var MAXIMUM_COMPLEXITY = 171;
  var results = _.reject(rawResults, _.isError);

  var complexitySum = _.sum(results, function(result) {
    // Maintainability: logarithmic scale from -infinity to 171, calculated from the logical lines
    // of code, the cyclomatix complexity and the Halstead effort. Higher is better.
    // http://ieeexplore.ieee.org/xpl/login.jsp?tp=&arnumber=242525&url=http%3A%2F%2Fieeexplore.ieee.org%2Fiel2%2F435%2F6237%2F00242525.pdf%3Farnumber%3D242525
    return result.maintainability;
  });

  return {
    // TODO: Determine if this is an appropriate scoring method for logarithmic data
    grade: complexitySum / results.length / MAXIMUM_COMPLEXITY,
    raw: results,
    errors: _.filter(rawResults, _.isError)
  };
};

ComplexityTest.prototype.test = function(cb) {
  var self = this;

  this.analyze(this.config.files)
    .then(this.process)
    .then(function(results) {
      self.logs.logs = self.logs.logs.concat(results.raw);
      self.logs.debug = self.logs.debug.concat(results.errors);
      self.grade = results.grade;
      cb(null, self);
    });
};

module.exports = ComplexityTest;
