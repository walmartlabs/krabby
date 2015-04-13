function badge(results, cb) {
  var score = results.reduce(function(total, result) {
    return total + (result.score || 0);
  }, 0);
  var url = 'https://img.shields.io/badge/repo%20grade-';

  score = score / results.length;

  if (score <= 0.59) {
    url += 'F-red';
  } else if (score <= 0.69) {
    url += 'D-red';
  } else if (score <= 0.79) {
    url += 'C-yellowgreen';
  } else if (score <= 0.89) {
    url += 'B-green';
  } else {
    url += 'A-brightgreen';
  }

  cb(url += '.svg');
}

module.exports = badge;
