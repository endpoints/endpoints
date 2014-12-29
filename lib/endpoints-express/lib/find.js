module.exports = function (source, receiver, opts) {
  if (!opts) {
    opts = {};
  }
  var singleItem = !!opts.singleItem;
  var prettyPrint = true;

  return function (request, response) {
    var filters = receiver.filters(request);
    var relations = receiver.relations(request);
    var query = source.filter(filters);
    source.fetch(query, relations, function (err, data) {
      var result;
      if (err) {
        throw err;
      } else {
        result = source.format(data);
        if (singleItem) {
          result = result[0];
        }
        if (prettyPrint) {
          result = JSON.stringify(result, false, 2);
        }
        response.set('content-type','application/json');
        response.send(result);
      }
    });
  };
};
