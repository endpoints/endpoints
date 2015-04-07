'use strict';

var _ = require('lodash');
var bPromise = require('bluebird');

exports.addCreate = function (adapter) {
  adapter.model.create = function (params, toManyRels) {
    // this should be in a transaction but we don't have access to it yet
    return this.forge(params).save(null, { method: 'insert' }).tap(function (model) {
      return bPromise.map(toManyRels, function (rel) {
        return model.related(rel.name).attach(rel.id);
      });
    }).then((function (model) {
      return this.forge({ id: model.id }).fetch();
    }).bind(this));
  };
};

exports.addUpdate = function (adapter) {
  // this should be in a transaction but we don't have access to it yet
  adapter.model.prototype.update = function (params, toManyRels, previous) {
    var clientState = _.extend(previous, params);
    return this.save(params, { patch: true, method: 'update' }).tap(function (model) {
      return bPromise.map(toManyRels, function (rel) {
        return model.related(rel.name).detach().then(function () {
          return model.related(rel.name).attach(rel.id);
        });
      });
    }).then(function (model) {
      // Bookshelf .previousAttributes() doesn't work
      // See: https://github.com/tgriesser/bookshelf/issues/326#issuecomment-76637186
      if (_.isEqual(model.toJSON({ shallow: true }), clientState)) {
        return null;
      }
      return model;
    });
  };
};