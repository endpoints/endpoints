//const _ = require('lodash');

module.exports = function (model, query, fields) {
  // this doesn't work because bookshelf automatically queries
  // all fields. also, by definition this query has to include
  // all to-one relationship fields or some of the eager fetching
  // wouldn't work
  // for now, these will have to be parsed out after the fact.
  // gross.
  //return query.columns(fields);
  return query;
};
