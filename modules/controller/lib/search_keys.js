module.exports = function (context, searchIn, name) {
  for (var i=0; i<searchIn.length; i++) {
    var location = searchIn[i];
    var lookup = context[location] || {};
    var value = lookup[name];
    if (value !== null && value !== undefined) {
      return value;
    }
  }
};
