'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports.create = create;
exports.update = update;

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _bPromise = require('bluebird');

var _bPromise2 = _interopRequireDefault(_bPromise);

function create(params, toManyRels) {
  // this should be in a transaction but we don't have access to it yet
  return this.forge(params).save(null, { method: 'insert' }).tap(function (model) {
    return _bPromise2['default'].map(toManyRels, function (rel) {
      return model.related(rel.name).attach(rel.id);
    });
  }).then((function (model) {
    return this.forge({ id: model.id }).fetch();
  }).bind(this));
}

function update(params, toManyRels, previous) {
  // this should be in a transaction but we don't have access to it yet
  var clientState = _import2['default'].extend(previous, params);
  return this.save(params, { patch: true, method: 'update' }).tap(function (model) {
    return _bPromise2['default'].map(toManyRels, function (rel) {
      return model.related(rel.name).detach().then(function () {
        return model.related(rel.name).attach(rel.id);
      });
    });
  }).then(function (model) {
    // Bookshelf .previousAttributes() doesn't work
    // See: https://github.com/tgriesser/bookshelf/issues/326#issuecomment-76637186
    if (_import2['default'].isEqual(model.toJSON({ shallow: true }), clientState)) {
      return null;
    }
    return model;
  });
}