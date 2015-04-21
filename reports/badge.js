var BaseKrabbyReport = require('./_baseReport');
var baseConfig = {};

function badge(results, cb) {
  var grade = results.reduce(function(total, result) {
    return total + (result.grade || 0);
  }, 0);
  var url = 'https://img.shields.io/badge/repo%20grade-';

  grade = grade / results.length;

  if (grade <= 0.59) {
    url += 'F-red';
  } else if (grade <= 0.69) {
    url += 'D-red';
  } else if (grade <= 0.79) {
    url += 'C-yellowgreen';
  } else if (grade <= 0.89) {
    url += 'B-green';
  } else {
    url += 'A-brightgreen';
  }

  cb(url += '.svg');
}

module.exports = new BaseKrabbyReport(baseConfig, badge);
