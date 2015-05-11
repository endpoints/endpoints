'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Generate JSON API compatible response objects from any data.
 */

var JsonApiFormat = (function () {

  /**
   * The constructor.
   *
   * @constructs JsonApiFormat
   * @param {Object} opts - configuration options
   * @param {Object} opts.store - the store to extract data with
   * @param {Object} opts.baseUrl - the baseUrl for hypermedia links
   */

  function JsonApiFormat() {
    var opts = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, JsonApiFormat);

    if (!opts.store) {
      throw new Error('No store specified.');
    }
    this.store = opts.store;
    this.baseUrl = opts.baseUrl || '';
  }

  /**
   * Generate self-referencing url.
   *
   * @param {*} model - a model
   * @return {String}
   */

  JsonApiFormat.prototype.selfUrl = function selfUrl(model) {
    return '' + this.baseUrl + '/' + this.store.id(model);
  };

  /**
   * Generate a related link.
   *
   * @param {*} model - a model
   * @return {String}
   */

  JsonApiFormat.prototype.relatedUrl = function relatedUrl(model, relation) {
    return '' + this.baseUrl + '/' + this.store.id(model) + '/' + relation;
  };

  /**
   * Generate a relation url.
   *
   * @param {*} model - a model
   * @return {String}
   */

  JsonApiFormat.prototype.relationUrl = function relationUrl(model, relation) {
    return '' + this.baseUrl + '/' + this.store.id(model) + '/links/' + relation;
  };

  /**
   * Generate JSON API compatible response objects from any data source
   * using the provided store.
   *
   * @param {*} input - the input data
   * @param {opts} opts - configurable options (@todo: cleanup)
   */

  JsonApiFormat.prototype.process = function process(input) {
    var opts = arguments[1] === undefined ? {} : arguments[1];
    var singleResult = opts.singleResult;
    var relations = opts.relations;
    var mode = opts.mode;

    var store = this.store;
    var format = this._format.bind(this);

    var data = [];
    var rawIncludes = [];
    var includedIndex = [];

    if (store.isMany(input)) {
      input.forEach(function (input) {
        var result = format(input, relations, mode);
        data.push(result.data);
        rawIncludes = rawIncludes.concat(result.included);
      });
    } else {
      var result = format(input, relations, mode);
      data = result.data;
      rawIncludes = result.included;
    }

    if (singleResult && Array.isArray(data)) {
      data = data.length ? data[0] : null;
    }

    // bail early with simple representation for relation mode
    if (mode === 'relation') {
      return {
        data: data,
        links: this._relate(input.sourceModel, input.relationName)
      };
    }

    // format the records to be included and ignore duplicates
    var included = rawIncludes.reduce(function (result, model) {
      var indexKey = '' + store.id(model) + '' + store.type(model);
      var skip = includedIndex.some(function (entry) {
        return entry == indexKey;
      });
      if (!skip) {
        // TODO: interlink these by logging which relation
        // each included model came from and then passing in
        // all included relations that are subrelations of it
        result.push(format(model).data);
        includedIndex.push(indexKey);
      }
      return result;
    }, []);

    return included.length ? { data: data, included: included } : { data: data };
  };

  /**
   * Format a model to JSON-API compliance and extract any related models
   * that should be sideloaded (included).
   *
   * @param {*} model - a model
   * @param {Array} includedRelations - an array of relation names to sideload
   * @param {String} mode - the mode to format for (null, related, relation)
   * @return {Object}
   */

  JsonApiFormat.prototype._format = function _format(model) {
    var includedRelations = arguments[1] === undefined ? [] : arguments[1];
    var mode = arguments[2] === undefined ? 'read' : arguments[2];

    var store = this.store;

    var id = String(store.id(model));
    var type = store.type(model);

    // relation mode only cares about id/type, return early
    if (mode === 'relation') {
      return { data: { id: id, type: type } };
    }

    // get all relations on the model
    var allRelations = store.allRelations(model);
    // get all toOne relations on the model
    var toOneRelations = store.toOneRelations(model);
    // get all relations for this model that weren't sideloaded (included)
    var linkedRelations = allRelations.filter(function (relation) {
      return includedRelations.indexOf(relation) === -1;
    });
    // build a links object for this model and get sideloaded (included) models

    var _link = this._link(model, includedRelations, linkedRelations);

    var links = _link.links;
    var included = _link.included;

    // start json-api serialization
    var attributes = store.serialize(model);
    // remove to-one foreign key attributes, they will appear in links
    // TODO: test performance here
    for (var rel in toOneRelations) {
      delete attributes[toOneRelations[rel]];
    }
    // remove id/type, they cannot be members of attributes
    delete attributes.id;
    delete attributes.type;

    // return the serialized model and all included models
    return { data: { id: id, type: type, attributes: attributes, links: links }, included: included };
  };

  /**
   * Generate a links object entry, including linkage if any is available.
   *
   * @param {*} model - the model the links object is being created for
   * @param {Array} includedRelations - an array of relations to sideload
   * @param {*} linkedRelations - a array of relations to simply link
   * @return {Object}
   */

  JsonApiFormat.prototype._link = function _link(model) {
    var _this = this;

    var includedRelations = arguments[1] === undefined ? [] : arguments[1];
    var linkedRelations = arguments[2] === undefined ? [] : arguments[2];

    var store = this.store;
    var links = {
      self: this.selfUrl(model)
    };
    var included = [];
    // iterate relations that were sideloaded (included)
    includedRelations.forEach(function (relation) {
      // get all sideloaded models for this relation
      var includes = store.related(model, relation);
      // build up a links object with linkage to the sideloaded models
      links[relation] = _this._relate(model, relation, includes);
      // keep track of sideloaded (included) models
      if (store.isMany(includes)) {
        // if the included relation was a collection, push only the models
        // if the collection is empty, don't do anything.
        included = includes.length ? included.concat(store.modelsFromCollection(includes)) : included;
      } else {
        // otherwise, push the singularly related model (as long as it exists)
        if (store.id(includes)) {
          included.push(includes);
        }
      }
    });
    // iterate relations that were not sideloaded (included)
    linkedRelations.forEach(function (relation) {
      // populate a links relation to tell client where to find related data
      links[relation] = _this._relate(model, relation);
    });
    // return links object for this model and all sideloaded (included) data
    return { links: links, included: included };
  };

  /**
   * Generate a links object entry, including linkage if any is available.
   *
   * @param {*} model - the model the links object is being created for
   * @param {String} relation - the relation to create a link object entry for
   * @param {*} included - a single model or a collection of models for linkage
   * @return {Object}
   */

  JsonApiFormat.prototype._relate = function _relate(model, relation, included) {
    var store = this.store;
    var self = this.relationUrl(model, relation);
    var related = this.relatedUrl(model, relation);
    if (!included) {
      return { self: self, related: related };
    }
    var linkage = null;
    if (store.isMany(included)) {
      linkage = included.reduce(function (result, model) {
        var id = store.id(model);
        if (id) {
          result.push({
            id: String(id),
            type: store.type(model)
          });
        }
        return result;
      }, []);
    } else {
      var id = store.id(included);
      if (id) {
        linkage = {
          id: String(store.id(included)),
          type: store.type(included)
        };
      }
    }
    return { self: self, related: related, linkage: linkage };
  };

  return JsonApiFormat;
})();

exports['default'] = JsonApiFormat;
module.exports = exports['default'];