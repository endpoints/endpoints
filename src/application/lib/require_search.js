import path from 'path';

import requireSilent from './require_silent';

export default function (file, searchPaths) {
  if (!searchPaths) {
    throw new Error('No searchPaths specified.');
  }
  var result = null;
  var len = searchPaths.length;
  for (var i = 0; i < len; i++) {
    var currentPath = path.join(searchPaths[i], file);
    var notFoundInFoundFile = false;
    result = requireSilent(currentPath);
    if (result instanceof Error) {
      // handle situations where a file is found, but requiring it
      // still throws a MODULE_NOT_FOUND error because that file
      // depends on something else which can't be found. boy this
      // is ugly.
      notFoundInFoundFile = result.message.indexOf(currentPath) === -1;
      if (result.code !== 'MODULE_NOT_FOUND' || notFoundInFoundFile) {
        throw result;
      } else {
        result = null;
      }
    } else {
      result = currentPath;
      break;
    }
  }
  if (!result) {
    throw new Error(
      `Unable to locate "${file}" in search paths: ${searchPaths.join(', ')}`
    );
  }
  return result;
}
