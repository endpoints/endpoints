// reading
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libAll_relations = require('./lib/all_relations');

var _libAll_relations2 = _interopRequireDefault(_libAll_relations);

var _libBy_id = require('./lib/by_id');

var _libBy_id2 = _interopRequireDefault(_libBy_id);

var _libId = require('./lib/id');

var _libId2 = _interopRequireDefault(_libId);

var _libIs_many = require('./lib/is_many');

var _libIs_many2 = _interopRequireDefault(_libIs_many);

var _libModels_from_collection = require('./lib/models_from_collection');

var _libModels_from_collection2 = _interopRequireDefault(_libModels_from_collection);

var _libRelated = require('./lib/related');

var _libRelated2 = _interopRequireDefault(_libRelated);

var _libRelated_collection = require('./lib/related_collection');

var _libRelated_collection2 = _interopRequireDefault(_libRelated_collection);

var _libRelated_model = require('./lib/related_model');

var _libRelated_model2 = _interopRequireDefault(_libRelated_model);

var _libTo_one_relations = require('./lib/to_one_relations');

var _libTo_one_relations2 = _interopRequireDefault(_libTo_one_relations);

var _libType = require('./lib/type');

var _libType2 = _interopRequireDefault(_libType);

var _libRead = require('./lib/read');

var _libRead2 = _interopRequireDefault(_libRead);

var _lib_read_for_related = require('./lib/_read_for_related');

var _lib_read_for_related2 = _interopRequireDefault(_lib_read_for_related);

var _libSerialize = require('./lib/serialize');

var _libSerialize2 = _interopRequireDefault(_libSerialize);

var _libFilters = require('./lib/filters');

var _libFilters2 = _interopRequireDefault(_libFilters);

var _libProp = require('./lib/prop');

var _libProp2 = _interopRequireDefault(_libProp);

// writing

var _libCreate = require('./lib/create');

var _libCreate2 = _interopRequireDefault(_libCreate);

var _libCreate_relation = require('./lib/create_relation');

var _libCreate_relation2 = _interopRequireDefault(_libCreate_relation);

var _libUpdate = require('./lib/update');

var _libUpdate2 = _interopRequireDefault(_libUpdate);

var _libDestroy = require('./lib/destroy');

var _libDestroy2 = _interopRequireDefault(_libDestroy);

var _libDestroy_relation = require('./lib/destroy_relation');

var _libDestroy_relation2 = _interopRequireDefault(_libDestroy_relation);

exports['default'] = {
  byId: _libBy_id2['default'],
  allRelations: _libAll_relations2['default'],
  id: _libId2['default'],
  isMany: _libIs_many2['default'],
  modelsFromCollection: _libModels_from_collection2['default'],
  relatedCollection: _libRelated_collection2['default'],
  relatedModel: _libRelated_model2['default'],
  related: _libRelated2['default'],
  toOneRelations: _libTo_one_relations2['default'],
  type: _libType2['default'],
  read: _libRead2['default'],
  serialize: _libSerialize2['default'],
  filters: _libFilters2['default'],
  prop: _libProp2['default'],
  create: _libCreate2['default'],
  update: _libUpdate2['default'],
  destroy: _libDestroy2['default'],
  readRelation: _lib_read_for_related2['default'].bind(null, 'relation'),
  createRelation: _libCreate_relation2['default'],
  destroyRelation: _libDestroy_relation2['default'],
  readRelated: _lib_read_for_related2['default'].bind(null, 'related') };
module.exports = exports['default'];