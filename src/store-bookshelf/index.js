// reading
import byId from './lib/by_id';
import allRelations from './lib/all_relations';
import id from './lib/id';
import isMany from './lib/is_many';
import modelsFromCollection from './lib/models_from_collection';
import related from './lib/related';
import toOneRelations from './lib/to_one_relations';
import type from './lib/type';
import read from './lib/read';
import _readForRelated from './lib/_read_for_related';
import serialize from './lib/serialize';
import filters from './lib/filters';

// writing
import create from './lib/create';
import createRelation from './lib/create_relation';
import update from './lib/update';
import destroy from './lib/destroy';
import destroyRelation from './lib/destroy_relation';

export default {
  byId,
  allRelations,
  id,
  isMany,
  modelsFromCollection,
  related,
  toOneRelations,
  type,
  read,
  serialize,
  filters,
  create,
  update,
  destroy,
  readRelation: _readForRelated.bind(null, 'relation'),
  createRelation,
  destroyRelation,
  readRelated: _readForRelated.bind(null, 'related'),
};
