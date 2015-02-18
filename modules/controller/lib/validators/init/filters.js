const _ = require('lodash');

module.exports = function(opts, source) {
  var invalidFilters = _.difference(Object.keys(opts.filters), source.filters());

  if (invalidFilters.length > 0) {
    throw new Error(
      'Model does not have filter(s): ' + invalidFilters.join(', ')
    );
  }
};
