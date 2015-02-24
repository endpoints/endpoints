/*
const _ = require('lodash');

function fkeys (model) {
  return model.relations.reduce(function (result, relationName) {
    var relation;
    if (relationName.indexOf('.') === -1) {
      relation = model.prototype[relationName]();
      console.log(relation);
    }
  }, {});
};

module.exports = function (model, query, fields) {
  fkeys(model);
  // this doesn't work because bookshelf automatically queries
  // all fields. also, by definition this query has to include
  // all to-one relationship fields or some of the eager fetching
  // wouldn't work
  // for now, these will have to be parsed out after the fact.
  // gross.
  //return query.columns(fields);
  return query;
};
*/
