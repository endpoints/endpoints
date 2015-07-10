/**
 * Generate JSON API compatible response objects from any data.
 *
 * TODO: Performance work is needed in this module. For example, the
 * relationships object is populated separately from the includes
 * array. This means that all relationship data is iterated through
 * multiple times.
 *
 * TODO: Add a unit testing suite--updates for changes around how
 * JSON-API manages `include` have introduced several edge cases.
 *
 */
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
    return this.baseUrl + '/' + this.store.id(model);
  };

  /**
   * Generate a related link.
   *
   * @param {*} model - a model
   * @return {String}
   */

  JsonApiFormat.prototype.relatedUrl = function relatedUrl(model, relation) {
    return this.baseUrl + '/' + this.store.id(model) + '/' + relation;
  };

  /**
   * Generate a relation url.
   *
   * @param {*} model - a model
   * @return {String}
   */

  JsonApiFormat.prototype.relationUrl = function relationUrl(model, relation) {
    return this.baseUrl + '/' + this.store.id(model) + '/relationships/' + relation;
  };

  /**
   * Generate JSON API compatible response objects from any data source
   * using the provided store.
   *
   * @param {*} input - the input data
   * @param {opts} opts - configurable options (@todo: cleanup)
   */

  JsonApiFormat.prototype.process = function process(input) {
    var _this = this;

    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var singleResult = opts.singleResult;
    var relations = opts.relations;
    var mode = opts.mode;

    var links = undefined;
    if (mode === 'relation') {
      links = this._relationshipLinks(input.sourceModel, input.relationName);
    }
    var data = undefined;
    if (this.store.isMany(input)) {
      data = input.map(function (input) {
        return _this.format(input, relations, mode);
      });
    } else {
      data = this.format(input, relations, mode);
    }
    if (singleResult && Array.isArray(data)) {
      data = data.length ? data[0] : null;
    }
    var included = undefined;
    if (relations && relations.length) {
      included = this.include(input, relations);
    }
    return {
      data: data,
      links: links,
      included: included
    };
  };

  /**
   * Format a model to JSON-API compliance.
   *
   * @param {*} model - a model
   * @param {Array} includedRelations - an array of relation names to sideload
   * @param {String} mode - the mode to format for (null, related, relation)
   * @return {Object}
   */

  JsonApiFormat.prototype.format = function format(model) {
    var includedRelations = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var mode = arguments.length <= 2 || arguments[2] === undefined ? 'read' : arguments[2];

    var store = this.store;
    var id = store.id(model);
    var type = store.type(model);
    // relation mode only cares about id/type, return early
    if (mode === 'relation') {
      return { id: id, type: type };
    }
    var links = {
      self: this.selfUrl(model)
    };
    // build a links object for this model and get sideloaded (included) models
    var relationships = this._relationships(model, includedRelations);
    // start json-api serialization
    var attributes = store.serialize(model);
    // FIXME: these delete calls are probably a performance killer
    // remove to-one foreign key attributes, they should appear in links
    var toOneRelations = store.toOneRelations(model);
    for (var rel in toOneRelations) {
      delete attributes[toOneRelations[rel]];
    }
    // remove id/type, they cannot be members of attributes
    delete attributes.id;
    delete attributes.type;
    // return the formatted model
    return {
      id: id,
      type: type,
      attributes: attributes,
      relationships: relationships,
      links: links
    };
  };

  /**
   * Format and inter-link all models related to a provided input and
   * ensure there are no duplicates.
   *
   * @param {*} input - the model(s) being related to
   * @param {String} relations - the relations to include
   * @return {Array}
   */

  JsonApiFormat.prototype.include = function include(input, relations) {
    var _this2 = this;

    var includedIndex = [];
    return relations.reduce(function (result, relation) {
      return result.concat(_this2._include(input, relation));
    }, []).reduce(function (result, doc) {
      // remove duplicates.
      // FIXME: this can produce invalid documents when there is
      // a nesting level higher than three.
      var indexKey = '' + doc.id + doc.type;
      var skip = includedIndex.some(function (entry) {
        return entry == indexKey;
      });
      if (!skip) {
        result.push(doc);
        includedIndex.push(indexKey);
      }
      return result;
    }, []);
  };

  /**
   * Generate an array of included models, inter-linking nested includes.
   *
   * @param {*} input - the model(s) being related to
   * @param {String} relation - the relations to include
   * @return {Array}
   */

  JsonApiFormat.prototype._include = function _include(input, relation) {
    var store = this.store;
    var format = this.format.bind(this);
    var nodes = relation.split('.');
    var nodeMap = {};
    return nodes.reduce(function (result, node, idx) {
      var prevNode = nodes[idx - 1];
      var nextNode = nodes[idx + 1];
      var relateTo = idx === 0 ? input : nodeMap[prevNode];
      var related = nodeMap[node] = store.related(relateTo, node);
      var current = store.isMany(related) ? store.modelsFromCollection(related) : [related];
      var nestedInclude = nextNode ? [nextNode] : [];
      return result.concat(current.map(function (model) {
        return format(model, nestedInclude);
      }));
    }, []);
  };

  /**
   * Generate a relationships object.
   *
   * @param {*} model - the model(s) being related to
   * @param {Array} includedRelations - the relations to include
   * @return {Object}
   */

  JsonApiFormat.prototype._relationships = function _relationships(model, includedRelations) {
    var _this3 = this;

    var store = this.store;
    var allRelations = store.allRelations(model);
    var toOneRelationMap = store.toOneRelations(model);
    var toOneRelations = Object.keys(toOneRelationMap);
    return allRelations.reduce(function (result, relation) {
      var relationNodes = relation.split('.');
      var isNested = relationNodes.length > 1;
      if (isNested) {
        relation = relationNodes[0];
      }
      var isToOne = toOneRelations.indexOf(relation) !== -1;
      var isIncluded = includedRelations.some(function (includeRelation) {
        return includeRelation.split('.')[0] === relation;
      });
      if (isToOne) {
        result[relation] = _this3._relateToOne(model, relation, toOneRelationMap[relation]);
      } else {
        result[relation] = _this3._relateToMany(model, relation, isIncluded);
      }
      return result;
    }, {});
  };

  /**
   * Generate data for a to-one relationship object.
   *
   * @param {*} model - the model being related to
   * @param {String} relation - the relation name to populate
   * @param {String} property - the property the relationship value is under.
   * @return {Object}
   */

  JsonApiFormat.prototype._relateToOne = function _relateToOne(model, relation, property) {
    var store = this.store;
    var links = this._relationshipLinks(model, relation);
    var id = store.prop(model, property);
    var type = store.type(store.relatedModel(model, relation));
    var data = {
      id: String(id),
      type: type
    };
    return {
      links: links,
      data: id ? data : null
    };
  };

  /**
   * Generate data for a to-many relationship object.
   *
   * @param {*} model - the model being related to
   * @param {String} relation - the relation name to populate
   * @param {Boolean} included - indicates if this should include data
   * @return {Object}
   */

  JsonApiFormat.prototype._relateToMany = function _relateToMany(model, relation, included) {
    var relationNodes = relation.split('.');
    var links = this._relationshipLinks(model, relationNodes[0]);
    if (!included) {
      return { links: links };
    }
    return {
      links: links,
      data: this._relationshipData(model, relationNodes[0])
    };
  };

  /**
   * Generate a links object for a relationship.
   *
   * @param {*} model - the model the relationships object is being created for
   * @param {String} relation - the name of the relation to link
   * @return {Object}
   */

  JsonApiFormat.prototype._relationshipLinks = function _relationshipLinks(model, relation) {
    return {
      self: this.relationUrl(model, relation),
      related: this.relatedUrl(model, relation)
    };
  };

  /**
   * Generate relationship data.
   *
   * @param {*} model - the model the relationship data is being created for
   * @param {String} relation - the name of the relation to load data for
   * @return {Object}
   */

  JsonApiFormat.prototype._relationshipData = function _relationshipData(model, relation) {
    var store = this.store;
    var included = store.related(model, relation);
    var data = null;
    if (store.isMany(included)) {
      data = included.reduce(function (result, model) {
        var id = store.id(model);
        if (id) {
          result.push({
            id: id,
            type: store.type(model)
          });
        }
        return result;
      }, []);
    } else {
      var id = store.id(included);
      if (id) {
        data = {
          id: store.id(included),
          type: store.type(included)
        };
      }
    }
    return data;
  };

  return JsonApiFormat;
})();

exports['default'] = JsonApiFormat;
module.exports = exports['default'];