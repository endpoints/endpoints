'use strict';

exports.__esModule = true;

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports['default'] = create;

var _bPromise = require('bluebird');

var _bPromise2 = _interopRequireDefault(_bPromise);

var _destructure = require('./destructure');

var _destructure2 = _interopRequireDefault(_destructure);

function create(model, method, params) {
  if (!model) {
    throw new Error('No model provided.');
  }
  if (!method) {
    throw new Error('No method provided to create with.');
  }
  if (!params) {
    params = {};
  }
  if (!model.create) {
    model.create = baseCreate;
  }
  return _destructure2['default'](model.forge(), params).then(function (destructured) {
    return model[method](destructured.data, destructured.toManyRels);
  });
}

// FIXME: the stuff below is gross. upstream to bookshelf... or something.

function baseCreate(params, toManyRels) {
  // this should be in a transaction but we don't have access to it yet
  return this.forge(params).save(null, { method: 'insert' }).tap(function (model) {
    return _bPromise2['default'].map(toManyRels, function (rel) {
      return model.related(rel.name).attach(rel.id);
    });
  }).then((function (model) {
    return this.forge({ id: model.id }).fetch();
  }).bind(this));
}
module.exports = exports['default'];