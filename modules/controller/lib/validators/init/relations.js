const _ = require('lodash');

module.exports = function(opts, source) {
  var invalidRelations = _.difference(opts.include, source.relations());
  if (invalidRelations.length > 0) {
    throw new Error(
      'Model does not have relation(s): ' + invalidRelations.join(', ')
    );
  }
};
