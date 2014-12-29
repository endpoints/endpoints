const extend = require('extend');

const parseOptions = require('./lib/parse_options');
const extract = require('./lib/extract');
const uniq = require('./lib/uniq');

function Receiver(opts) {
  extend(this, parseOptions(opts));
}

Receiver.prototype.filters = function (request) {
  return extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    // named params in the route are automatically included with the
    // user-supplied list of valid params. given a route /resource/:id
    // the param 'id' will be considered valid even if it isn't listed
    // in the paramsForfilters property.
    find: this.allowedFilters.concat(Object.keys(request.params)),
    normalizer: this.paramNormalizer
  });
};

Receiver.prototype.relations = function (request) {
  var result = [];
  var requestedRelations = extract({
    context: request,
    contextKeysToSearch: this.requestKeysToSearch,
    find: this.relationKey,
    normalizer: this.paramNormalizer
  });
  var allowedRelations = this.allowedRelations;
  if (requestedRelations) {
    if (!Array.isArray(requestedRelations)) {
      requestedRelations = [requestedRelations];
    };
    result = requestedRelations.filter(function (relation) {
      return allowedRelations.indexOf(relation) !== -1;
    });
  }
  return result;
};

module.exports = Receiver;
