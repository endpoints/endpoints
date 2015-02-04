module.exports = function (file) {
  var result = null;
  try {
    result = require(file);
  } catch (e) { }
  return result;
};
