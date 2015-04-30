'use strict';

var krabbyTest = require('./_baseTest');
var _ = require('lodash');
var fs = require("fs");
var path = require('path');

var baseConfig = {};

var ComplexityTest = new krabbyTest(baseConfig);

ComplexityTest.prototype.getConfig = function(filePath) {
  var fileExists = fs.lstatSync(filePath).isFile();
  return fileExists ? require(filePath) : null;
}

// Uses a binomial to decrease the score at a near exponential rate with full failure at 13 excludes
ComplexityTest.prototype.gradeResults = function(results) {
  var MULTIPLIER = 7;
  var EXPONENT = 1.25;

  var excludes = _.chain(results)
    .map(_.identity)
    .flatten()
    .value();

  if (excludes.length === 0) { return 1; }

  var dockedPoints = MULTIPLIER * excludes.length + Math.pow(1.25, excludes.length);
  dockedPoints = dockedPoints > 100 ? 100 : dockedPoints;
  return (100 - dockedPoints)/100;
}

ComplexityTest.prototype.test = function(cb) {
  if (_.isEmpty(this.config.track)) {
    cb(new Error("No Track defined"));
    return;
  }

  var tracks = _.isString(this.config.track) ? [this.config.track] : this.config.track;

  var repoExcludes = _.map(tracks, function(track) {
    var filePath = path.resolve(track, "atlas-project-config.js");
    var config = this.getConfig(filePath);

    if (config) {
      return config.coverageExcludes || {}
    } else {
      this.logs.debug.push(new Error("File: " + filePath + "does not exist"));
      return {};
    }
  }, this);
  repoExcludes = _.zipObject(tracks, repoExcludes);

  this.logs.logs = repoExcludes;
  this.grade = _.sum(repoExcludes, this.gradeResults);
  cb(null, this);
};

module.exports = ComplexityTest;
