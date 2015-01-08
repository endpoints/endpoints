// this is crap, but i need it. NOW.

const MAPPING = {
  'application/vnd.ember+json': 'ember'
};

module.exports = function (accepts) {
  var mode = 'api';
  if (Array.isArray(accepts)) {
    for (var type in accepts) {
      var format = MAPPING[accepts[type]];
      if (format) {
        mode = format;
        break;
      }
    }
  }
  return mode;
};
