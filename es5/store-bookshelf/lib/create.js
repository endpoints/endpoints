'use strict';

exports.__esModule = true;
exports['default'] = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _transact = require('./_transact');

var _transact2 = _interopRequireDefault(_transact);

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
    return _transact2['default'](model, function (transaction) {
      return model[method](transaction, destructured.attributes, destructured.relations);
    });
  });
}

// FIXME: the stuff below is gross. upstream to bookshelf... or something.

function baseCreate(transaction, attributes, relations) {
  // this should be in a transaction but we don't have access to it yet
  return this.forge(attributes).save(null, {
    method: 'insert',
    transacting: transaction
  }).tap(function (model) {
    return _bluebird2['default'].map(relations, function (rel) {
      return model.related(rel.name).detach(undefined, {
        transacting: transaction
      }).then(function () {
        return model.related(rel.name).attach(rel.id, {
          transacting: transaction
        });
      });
    });
  }).then((function (model) {
    return this.forge({ id: model.id }).fetch({
      transacting: transaction
    });
  }).bind(this));
}
module.exports = exports['default'];