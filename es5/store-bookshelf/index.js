'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
// reading

var _byId = require('./lib/by_id');

var _byId2 = _interopRequireWildcard(_byId);

var _allRelations = require('./lib/all_relations');

var _allRelations2 = _interopRequireWildcard(_allRelations);

var _id = require('./lib/id');

var _id2 = _interopRequireWildcard(_id);

var _isMany = require('./lib/is_many');

var _isMany2 = _interopRequireWildcard(_isMany);

var _modelsFromCollection = require('./lib/models_from_collection');

var _modelsFromCollection2 = _interopRequireWildcard(_modelsFromCollection);

var _related = require('./lib/related');

var _related2 = _interopRequireWildcard(_related);

var _toOneRelations = require('./lib/to_one_relations');

var _toOneRelations2 = _interopRequireWildcard(_toOneRelations);

var _type = require('./lib/type');

var _type2 = _interopRequireWildcard(_type);

var _read = require('./lib/read');

var _read2 = _interopRequireWildcard(_read);

var _readForRelated2 = require('./lib/_read_for_related');

var _readForRelated3 = _interopRequireWildcard(_readForRelated2);

var _serialize = require('./lib/serialize');

var _serialize2 = _interopRequireWildcard(_serialize);

var _filters = require('./lib/filters');

var _filters2 = _interopRequireWildcard(_filters);

// writing

var _create = require('./lib/create');

var _create2 = _interopRequireWildcard(_create);

var _update = require('./lib/update');

var _update2 = _interopRequireWildcard(_update);

var _destroy = require('./lib/destroy');

var _destroy2 = _interopRequireWildcard(_destroy);

exports['default'] = {
  byId: _byId2['default'],
  allRelations: _allRelations2['default'],
  id: _id2['default'],
  isMany: _isMany2['default'],
  modelsFromCollection: _modelsFromCollection2['default'],
  related: _related2['default'],
  toOneRelations: _toOneRelations2['default'],
  type: _type2['default'],
  read: _read2['default'],
  readRelated: _readForRelated3['default'].bind(null, 'related'),
  readRelation: _readForRelated3['default'].bind(null, 'relation'),
  serialize: _serialize2['default'],
  filters: _filters2['default'],
  create: _create2['default'],
  update: _update2['default'],
  destroy: _destroy2['default']
};
module.exports = exports['default'];