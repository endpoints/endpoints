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
  // knex's query builder is sync, but we want to support
  // async query building without releasing zalgo, thus
  // the synthetic deferral.
  process.nextTick(function () {
    cb(null, query);  
  });
};

Model.prototype.fetch = function (query, opts, cb) {
  if (!opts) {
    opts = {};
  }
  query.fetch(opts).then(function (results) {
    cb(null, results.models);
  }).catch(function (err) {
    cb(err);
  });
};

Model.prototype.fetchOne = function (query, opts, cb) {
  if (!opts) {
    opts = {};
  }
  query.fetchOne(opts).then(function (results) {
    cb(null, results);
  }).catch(function (err) {
    cb(err);
  });
};

module.exports = Model;
