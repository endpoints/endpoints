const _ = require('lodash');

const parseOptions = require('./lib/parse_options');
const jsonApi = require('../formatter-jsonapi');

function Source (opts) {
  _.extend(this, parseOptions(opts));
}

Source.prototype.filters = function () {
  return this.model.filters||{};
};

Source.prototype.relations = function () {
  return Object.keys(this.model.relations||{});
};

Source.prototype.typeName = function () {
  return this.model.typeName;
};

Source.prototype.filter = function (params) {
  return this.model.filter(params);
};

Source.prototype.byId = function (id, cb) {
  return this.model.byId(id, cb);
};

Source.prototype.create = function (method, params, cb) {
  if (!this.model[method]) {
    cb(new Error('No method "'+method+'" found on model.'));
  } else {
    this.model[method](params, cb);
  }
};

Source.prototype.read = function (opts, cb) {
  if (!opts) {
    opts = {};
  }
  var filters = opts.filters;
  var relations = opts.relations||[];
  var query = this.filter(filters);
  var allowedRelations = this.relations();
  var validRelations = relations.filter(function (relation) {
    return allowedRelations.indexOf(relation) !== -1;
  });
  var data = query.value();
  process.nextTick(function () {
    if (!data.length) {
      return cb(null, null);
    }
    var singleResult = (opts.one && data.length === 1);
    var noSingleResult = (opts.one && data.length === 0);
    if (noSingleResult) {
      return cb(null, null);
    }
    cb(null, jsonApi(data, {
      singleResult: singleResult,
      model: this.model,
      relations: validRelations
    }));
  }.bind(this));
};

Source.prototype.update = function (model, params, cb) {
  return model.save(params, {patch:true}).exec(cb);
};

Source.prototype.destroy = function (model, cb) {
  return model.destroy().exec(cb);
};

module.exports = Source;
