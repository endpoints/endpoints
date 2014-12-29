module.exports = function (value) {
  var delim = ',';
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      value = true;
    } else if (value.toLowerCase() === 'false') {
      value = false;
    } else if (value.indexOf(delim) !== -1) {
      value = value.split(delim);
    }
  }
  return value;
};
