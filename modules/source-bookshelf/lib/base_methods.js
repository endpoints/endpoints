exports.addFilter = function (source) {
  var model = source.model;
  model.filter = function (params) {
    if (!params) {
      params = {};
    }
    var filters = source.filters();
    // open query builder for this model
    return model.collection().query(function (qb) {
      // iterate over all params we explicitly support in the request
      // filtering the query
      qb = Object.keys(params).reduce(function (result, key) {
        var value = params[key];
        // see if there is a finder on the model for this param
        var filter = filters[key];
        // START BRITTLE HACK
        if (key === 'id') {
          filter = function (qb, value) {
            return qb.whereIn('id', value);
          };
        }
        // END BRITTLE HACK
        // process the query with the filter, or, if none is found, pass it
        return filter ? filter.call(filters, qb, value, params) : qb;
      }, qb);
    });
  };
};

exports.addCreate = function (source) {
  source.model.create = function (params) {
    return this.forge(params).save().then(function (model) {
      return this.forge({id:model.id}).fetch();
    }.bind(this));
  };
};

exports.addUpdate = function (source) {
  source.model.prototype.update = function (params) {
    return this.save(params, {patch: true});
  };
};
