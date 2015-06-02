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
class JsonApiFormat {

  /**
   * The constructor.
   *
   * @constructs JsonApiFormat
   * @param {Object} opts - configuration options
   * @param {Object} opts.store - the store to extract data with
   * @param {Object} opts.baseUrl - the baseUrl for hypermedia links
   */
  constructor(opts={}) {
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
  selfUrl (model) {
    return `${this.baseUrl}/${this.store.id(model)}`;
  }

  /**
   * Generate a related link.
   *
   * @param {*} model - a model
   * @return {String}
   */
  relatedUrl (model, relation) {
    return `${this.baseUrl}/${this.store.id(model)}/${relation}`;
  }

  /**
   * Generate a relation url.
   *
   * @param {*} model - a model
   * @return {String}
   */
  relationUrl (model, relation) {
    return `${this.baseUrl}/${this.store.id(model)}/relationships/${relation}`;
  }

  /**
   * Generate JSON API compatible response objects from any data source
   * using the provided store.
   *
   * @param {*} input - the input data
   * @param {opts} opts - configurable options (@todo: cleanup)
   */
  process (input, opts={}) {
    const {singleResult, relations, mode} = opts;
    let links;
    if (mode === 'relation') {
      links = this._relationshipLinks(input.sourceModel, input.relationName);
    }
    let data;
    if (this.store.isMany(input)) {
      data = input.map((input) => this.format(input, relations, mode));
    } else {
      data = this.format(input, relations, mode);
    }
    if (singleResult && Array.isArray(data)) {
      data = data.length ? data[0] : null;
    }
    let included;
    if (relations && relations.length) {
      included = this.include(input, relations);
    }
    return {
      data,
      links,
      included
    };
  }

  /**
   * Format a model to JSON-API compliance.
   *
   * @param {*} model - a model
   * @param {Array} includedRelations - an array of relation names to sideload
   * @param {String} mode - the mode to format for (null, related, relation)
   * @return {Object}
   */
  format(model, includedRelations=[], mode='read') {
    const store = this.store;
    const id = store.id(model);
    const type = store.type(model);
    // relation mode only cares about id/type, return early
    if (mode === 'relation') {
      return { id, type };
    }
    const links = {
      self: this.selfUrl(model)
    };
    // build a links object for this model and get sideloaded (included) models
    const relationships = this._relationships(model, includedRelations);
    // start json-api serialization
    const attributes = store.serialize(model);
    // FIXME: these delete calls are probably a performance killer
    // remove to-one foreign key attributes, they should appear in links
    const toOneRelations = store.toOneRelations(model);
    for (let rel in toOneRelations) {
      delete attributes[toOneRelations[rel]];
    }
    // remove id/type, they cannot be members of attributes
    delete attributes.id;
    delete attributes.type;
    // return the formatted model
    return {
      id,
      type,
      attributes,
      relationships,
      links
    };
  }

  /**
   * Format and inter-link all models related to a provided input and
   * ensure there are no duplicates.
   *
   * @param {*} input - the model(s) being related to
   * @param {String} relations - the relations to include
   * @return {Array}
   */
  include(input, relations) {
    const includedIndex = [];
    return relations.reduce((result, relation) => {
      return result.concat(this._include(input, relation));
    }, []).reduce((result, doc) => {
      // remove duplicates.
      // FIXME: this can produce invalid documents when there is
      // a nesting level higher than three.
      const indexKey = `${doc.id}${doc.type}`;
      const skip = includedIndex.some((entry) => entry == indexKey);
      if (!skip) {
        result.push(doc);
        includedIndex.push(indexKey);
      }
      return result;
    }, []);
  }

  /**
   * Generate an array of included models, inter-linking nested includes.
   *
   * @param {*} input - the model(s) being related to
   * @param {String} relation - the relations to include
   * @return {Array}
   */
  _include (input, relation) {
    const store = this.store;
    const format = this.format.bind(this);
    const nodes = relation.split('.');
    const nodeMap = {};
    return nodes.reduce((result, node, idx) => {
      const prevNode = nodes[idx - 1];
      const nextNode = nodes[idx + 1];
      const relateTo = idx === 0 ? input : nodeMap[prevNode];
      const related = nodeMap[node] = store.related(relateTo, node);
      const current = store.isMany(related) ?
        store.modelsFromCollection(related) : [related];
      const nestedInclude = nextNode ? [nextNode] : [];
      return result.concat(
        current.map((model) => format(model, nestedInclude))
      );
    }, []);
  }

  /**
   * Generate a relationships object.
   *
   * @param {*} model - the model(s) being related to
   * @param {Array} includedRelations - the relations to include
   * @return {Object}
   */
  _relationships(model, includedRelations) {
    const store = this.store;
    const allRelations = store.allRelations(model);
    const toOneRelationMap = store.toOneRelations(model);
    const toOneRelations = Object.keys(toOneRelationMap);
    return allRelations.reduce((result, relation) => {
      const relationNodes = relation.split('.');
      const isNested = relationNodes.length > 1;
      if (isNested) {
        relation = relationNodes[0];
      }
      const isToOne = toOneRelations.indexOf(relation) !== -1;
      const isIncluded = includedRelations.some((includeRelation) => {
        return includeRelation.split('.')[0] === relation;
      });
      if (isToOne) {
        result[relation] =
          this._relateToOne(model, relation, toOneRelationMap[relation]);
      } else {
        result[relation] =
          this._relateToMany(model, relation, isIncluded);
      }
      return result;
    }, {});
  }

  /**
   * Generate data for a to-one relationship object.
   *
   * @param {*} model - the model being related to
   * @param {String} relation - the relation name to populate
   * @param {String} property - the property the relationship value is under.
   * @return {Object}
   */
  _relateToOne (model, relation, property) {
    const store = this.store;
    const links = this._relationshipLinks(model, relation);
    const id = store.prop(model, property);
    const type = store.type(store.relatedModel(model, relation));
    const data = {
      id: String(id),
      type
    };
    return {
      links,
      data: id ? data : null
    };
  }

  /**
   * Generate data for a to-many relationship object.
   *
   * @param {*} model - the model being related to
   * @param {String} relation - the relation name to populate
   * @param {Boolean} included - indicates if this should include data
   * @return {Object}
   */
  _relateToMany (model, relation, included) {
    const relationNodes = relation.split('.');
    const links = this._relationshipLinks(model, relationNodes[0]);
    if (!included) {
      return { links };
    }
    return {
      links,
      data: this._relationshipData(model, relationNodes[0])
    };
  }

  /**
   * Generate a links object for a relationship.
   *
   * @param {*} model - the model the relationships object is being created for
   * @param {String} relation - the name of the relation to link
   * @return {Object}
   */
  _relationshipLinks(model, relation) {
    return {
      self: this.relatedUrl(model, relation),
      related: this.relationUrl(model, relation)
    };
  }

  /**
   * Generate relationship data.
   *
   * @param {*} model - the model the relationship data is being created for
   * @param {String} relation - the name of the relation to load data for
   * @return {Object}
   */
  _relationshipData(model, relation) {
    const store = this.store;
    const included = store.related(model, relation);
    let data = null;
    if (store.isMany(included)) {
      data = included.reduce(function (result, model) {
        const id = store.id(model);
        if (id) {
          result.push({
            id,
            type: store.type(model)
          });
        }
        return result;
      }, []);
    } else {
      const id = store.id(included);
      if (id) {
        data = {
          id: store.id(included),
          type: store.type(included)
        };
      }
    }
    return data;
  }

}

export default JsonApiFormat;
