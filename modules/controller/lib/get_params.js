const _ = require('lodash');
const splitStringProps = require('./split_string_props');

module.exports = function (request, opts) {
  var query = request.query || {};
  var requestOpts = _.cloneDeep(opts);
  var include = query.include;
  var filter = query.filter;
  var fields = query.fields;
  var sort = query.sort;
  return {
    include: include ? include.split(',') : requestOpts.include,
    // todo: normalize true/false strings to booleans here
    filter: filter ? splitStringProps(filter) : requestOpts.filter,
    fields: fields ? splitStringProps(fields) : requestOpts.fields,
    sort: sort ? sort.split(',') : requestOpts.sort
  };
};
