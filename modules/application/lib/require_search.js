const path = require('path');

const requireSilent = require('./require_silent');

module.exports = function (file, searchPaths) {
  var result = null;
  var len = searchPaths.length;
  for (var i = 0; i < len; i++) {
    var currentPath = path.join(searchPaths[i], file);
    if (requireSilent(currentPath)) {
      result = currentPath;
      break;
    }
  }
  if (!result) {
    throw new Error(
      'Unable to locate "' + file + '" in search paths: ' + searchPaths.join(', ')
    );
  }
  return result;
};
