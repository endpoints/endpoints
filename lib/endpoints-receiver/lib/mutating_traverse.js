function process (obj, fn) {
  for (var k in obj) {
    var node = obj[k];
    if (obj.hasOwnProperty(k)) {
      if (typeof node === 'object') {
        obj[k] = process(node, fn);
      } else {
        obj[k] = fn(node);
      }
    }
  }
  return obj;
}

module.exports = process;
