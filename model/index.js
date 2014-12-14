function Model (model) {
  this.model = model;
}

Model.prototype.filter = function (params, request, cb) {
  var model = this.model;
  // open query builder for this model
  var query = model.collection().query(function (qb) {
    // iterate over all params we explicitly support in the request
    // using the query builder to filter down the query
    params.forEach(function (param) {
      // see if there is a finder on the model for this param
      var finder = model.finders[param];
      // get the value for the param using req.param from express
      // http://expressjs.com/api.html#req.param
      var value = request(param);
      if (finder && value) {
        // use the finder on the model to limit the query
        qb = finder(qb, value);
      }
    });
  });
  cb(null, query);
}

module.exports = Model;
