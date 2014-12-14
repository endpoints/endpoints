function Source (model) {
  this.model = model;
}

Source.prototype.filter = function (params, cb) {
  var model = this.model;
  // open query builder for this model
  var query = model.collection().query(function (qb) {
    // iterate over all params we explicitly support in the request
    // using the query builder to filter down the query
    Object.keys(params).forEach(function (key) {
      // see if there is a finder on the model for this param
      var finder = model.finders[key];
      // get the value for the param using req.param from express
      // http://expressjs.com/api.html#req.param
      var value = params[key];
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

Source.prototype.fetch = function (query, opts, cb) {
  if (!opts) {
    opts = {};
  }
  query.fetch(opts).then(function (results) {
    cb(null, results.models);
  }).catch(function (err) {
    cb(err);
  });
};

Source.prototype.fetchOne = function (query, opts, cb) {
  if (!opts) {
    opts = {};
  }
  query.fetchOne(opts).then(function (results) {
    cb(null, results);
  }).catch(function (err) {
    cb(err);
  });
};

module.exports = Source;
