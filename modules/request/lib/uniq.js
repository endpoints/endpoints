module.exports = function (arr) {
  return arr.reduce(function (result, item) {
    if (result.indexOf(item) < 0) {
      result.push(item);
    }
    return result;
  }, []);
};
