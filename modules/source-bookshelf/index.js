const baseMethods = require('./lib/base_methods');
const formatters = {
  jsonApi: require('./lib/formatters/json_api'),
  raw: require('./lib/formatters/raw')
};

function Source (opts) {
  if (!opts) {
    opts = {};
  }
  var model = opts.model;
  if (!model) {
    throw new Error('No bookshelf model specified.');
  }
  this.model = model;

  // add missing methods on the model if needed. eventually something
  // like this should exist in bookshelf or another higher order library
  // natively.
  if (!model.filter) {
    baseMethods.addFilter(this);
  }
  if (!model.byId) {
    baseMethods.addById(this);
  }
}

Source.prototype.filters = function () {
  return this.model.filters||{};
};

Source.prototype.relations = function () {
  return this.model.relations||[];
};

Source.prototype.typeName = function () {
  return this.model.typeName;
};

Source.prototype.filter = function (params) {
  return this.model.filter(params);
};

Source.prototype.create = function (method, params, cb) {
  if (!method) {
    method = 'create';
  }
  if (!this.model[method]) {
    cb(new Error('No method "'+method+'" found on model.'));
  } else {
    this.model[method](params).then(function (result) {
      cb(null, result);
    }).catch(function (err) {
      cb(err);
    });
  }
};

Source.prototype.byId = function (id, cb) {
  return this.model.byId(id).exec(cb);
};

Source.prototype.read = function (opts, cb) {
  if (!opts) {
    opts = {};
  }
  var filters = opts.filters;
  var relations = opts.relations||[];
  var mode = opts.mode;
  var formatter = formatters[mode];
  var query = this.filter(filters);
  var allowedRelations = this.relations();
  var validRelations = relations.filter(function (relation) {
    return allowedRelations.indexOf(relation) !== -1;
  });
  query.fetch({withRelated:validRelations}).exec(function (err, data) {
    if (!data) {
      return cb(null, null);
    }
    var singleResult = (opts.one && data.length === 1);
    var noSingleResult = (opts.one && data.length === 0);
    if (err) {
      return cb(err);
    }
    if (noSingleResult) {
      return cb(null, null);
    }
    var output = formatter(data, {
      singleResult: singleResult,
      relations: validRelations
    });
    cb(null, output);
  });
};

Source.prototype.update = function (model, params, cb) {
  return model.save(params, {patch:true}).exec(cb);
};

Source.prototype.destroy = function (model, cb) {
  return model.destroy().exec(cb);
};

module.exports = Source;
