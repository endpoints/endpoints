// FIXME: this needs to be refactored to support other api formats, or
// moved wholesale into another model

import _ from 'lodash';

import columns from './columns';
import toOneRelations from './to_one_relations';
import allRelations from './all_relations';

export default function destructure (model, params={}) {
  const relationships = params.relationships || {};
  const relationshipNames = _.keys(relationships);
  const allRels = allRelations(model);
  const toOneRelsMap = toOneRelations(model);
  const toOneRels = Object.keys(toOneRelsMap);
  const toManyRels = _.difference(allRels, toOneRels);
  const linkedToOneRels = _.intersection(relationshipNames, toOneRels);
  const linkedToManyRels = _.intersection(relationshipNames, toManyRels);

  // TODO blow up here with kapow, someone is trying to link something that
  // doesn't exist.
  //const badRelations = _.difference(linkRelations, allRels);

  // TODO we need a hook to check if the target related resources exist
  // so we can blow up if they don't.
  // This hook should have context about the request so we can enforce
  // permissions based on who is trying to update/create something.
  const attributes = linkedToOneRels.reduce(function (result, relationName) {
    const relation = relationships[relationName];
    const fkey = toOneRelsMap[relationName];
    const value = relation.data && relation.data.id;
    result[fkey] = value;
    return result;
  }, params.attributes || {});

  const relations = linkedToManyRels.map(function (relationName) {
    const relation = relationships[relationName];
    return {
      name: relationName,
      data: relation.data
    };
  });

  return columns(model).then(function (modelColumns) {
    if (_.contains(modelColumns, 'id') && params.id) {
      attributes.id = params.id;
    }
    return { attributes, relations };
  });
}
