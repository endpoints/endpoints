const _ = require('lodash');

module.exports = function (request, opts) {
  var query = request.query || {};
  var include = query.include;
  var filter = query.filter;
  var fields = query.fields;
  var sort = query.sort;
  return {
    include: include ? include.split(',') : opts.include,
    filter: _.extend((filter ? filter : opts.filter), request.params),
    fields: fields ? fields : opts.fields,
    sort: sort ? sort.split(',') : opts.sort
  };
};
