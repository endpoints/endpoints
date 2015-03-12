module.exports = function(data) {
  delete data.type;
  delete data.links;
  return data;
};
