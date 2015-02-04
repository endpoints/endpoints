// Initialize a key on a provided object to an array.
module.exports = function getKey (source, key) {
  if (!source[key]) {
    source[key] = [];
  }
  return source[key];
};
