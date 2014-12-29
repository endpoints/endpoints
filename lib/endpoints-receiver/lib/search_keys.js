module.exports = function (context, searchIn, name) {
  for (i=0; i<searchIn.length; i++) {
    var location = searchIn[i];
    var lookup = context[location] || {};
    var value = lookup[name];
    // != is on purpose.
    if (value != null) {
      return value;
    }
  }
};
