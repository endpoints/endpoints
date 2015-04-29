'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

var _formatModel = require('./lib/format_model');

var _formatModel2 = _interopRequireDefault(_formatModel);

/**
  The role of this module is to take a single model or collection of models
  and convert them into a representation that is json-api compliant.

  @param {Bookshelf.Model|Bookshelf.Collection} input
  @param {Object} opts -
     singleResult: boolean indicating if result should be singular
                     this is needed because the querying system always
                     returns a collection--but sometimes you only want
                     a single item (e.g. /authors/1)
       relations: an array of dot-notated relation strings. these relations
                  are attached to the model and need to be extracted into
                  the top level included collection
       typeName: the type of the primary resource being requested
                 i think we might be able to remove this, it should always
                 be available off the collection
  @returns {Object|Array} json-api compliant formatted response

*/

exports['default'] = function (input) {
  var opts = arguments[1] === undefined ? {} : arguments[1];

  var included = [];
  var topLevelLinks;

  /**
    Recieves each model that was explictly sideloaded
    For example given a request `GET /author/1?include=books`, each book
    related to the author would pass through this method.
     @param {Object} model - Explicitly sideloaded model.
  */
  opts.exporter = function (model) {
    // each model that appears in the top level included object is itself
    // a bookshelf model that needs to be formatted for json-api compliance
    // too. we *could* allow links within links by recursing here but i
    // don't think it is needed... yet?
    included.push(_formatModel2['default'](null, model));
  };

  opts.topLevelLinker = function (links) {
    topLevelLinks = links;
  };

  /**
    @todo formatting?
    This is is a partially applied version of formatModel.
  */
  var formatter = _formatModel2['default'].bind(null, opts);

  /**
    Formats every incoming model
  */
  var serialized = input.map ? input.map(formatter) : formatter(input);

  /**
    If we are requesting a single item, return it as an object, not an array.
  */
  if (opts.singleResult && _import2['default'].isArray(serialized)) {
    serialized = input.length ? serialized[0] : null;
  }

  /**
    Prepare json-api compliant output
  */
  var output = {
    data: serialized
  };

  if (topLevelLinks) {
    output.links = topLevelLinks;
  }

  // if the exporter was ever called, we should have objects in
  // the included array. since it is possible for the same model
  // to be included more than once, prune any duplicates.
  if (included.length > 0) {
    output.included = _import2['default'](included).flatten().uniq(function (rel) {
      return rel.type + rel.id;
    }).value();
  }

  /**
   "bam, done."
  */
  return output;
};

module.exports = exports['default'];