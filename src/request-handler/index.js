const COLLECTION_MODE = 'collection';
const SINGLE_MODE = 'single';
const RELATION_MODE = 'relation';
const RELATED_MODE = 'related';

import _ from 'lodash';
import Kapow from 'kapow';

import throwIfModel from './lib/throw_if_model';
import throwIfNoModel from './lib/throw_if_no_model';
import verifyAccept from './lib/verify_accept';
import verifyContentType from './lib/verify_content_type';
import verifyDataObject from './lib/verify_data_object';
import splitStringProps from './lib/split_string_props';
import verifyClientGeneratedId from './lib/verify_client_generated_id';
import verifyFullReplacement from './lib/verify_full_replacement';

/**
  Provides methods for pulling out json-api relevant data from
  express or hapi request instances. Also provides route level
  validation.
*/
class RequestHandler {

  /**
    The constructor.

    @constructs RequestHandler
    @param {Endpoints.Store.*} store
  */
  constructor (config={}) {
    this.config = config;
  }

  get method() {
    return this.config.method;
  }

  get store() {
    return this.config.store;
  }

  get model() {
    return this.config.model;
  }

  /**
    A function that, given a request, validates the request.

    @returns {Object} An object containing errors, if any.
  */
  validate (request) {

    var err;
    var validators = [verifyAccept];

    if (request.body && request.body.data) {
      var clientIdCheck =
        request.method === 'POST' &&
        // posting to a relation endpoint is for appending
        // relationships and and such is allowed (must have, really)
        // ids
        this.mode(request) !== RELATION_MODE &&
        !this.config.allowClientGeneratedIds;

      // this applies for both "base" and relation endpoints
      var fullReplacementCheck =
        request.method === 'PATCH' &&
        !this.config.allowToManyFullReplacement;

      if (clientIdCheck) {
        validators.push(verifyClientGeneratedId);
      }
      if (fullReplacementCheck) {
        validators.push(verifyFullReplacement);
      }
      validators = validators.concat([
        verifyContentType,
        verifyDataObject
      ]);
    }

    // does this.validators needs a better name? controllerValidator, userValidators?
    validators = validators.concat(this.config.validators);

    for (var validate in validators) {
      err = validators[validate](request, this);
      if (err) {
        break;
      }
    }
    return err;
  }

  /**
    Builds a query object to be passed to Endpoints.Adapter#read.

    @returns {Object} The query object on a request.
   */
  query (request) {
    // bits down the chain can mutate this config
    // on a per-request basis, so we need to clone
    const config = _.cloneDeep(_.omit(this.config, ['store', 'model']));
    const {include, filter, fields, sort} = request.query;
    return {
      include: include ? include.split(',') : config.include,
      filter: filter ? splitStringProps(filter) : config.filter,
      fields: fields ? splitStringProps(fields) : config.fields,
      sort: sort ? sort.split(',') : config.sort
    };
  }

  /**
    Determines mode based on what request.params are available.

    @returns {String} the read mode
  */
  mode (request) {
    const hasIdParam = !!request.params.id;
    const hasRelationParam = !!request.params.relation;
    const hasRelatedParam = !!request.params.related;

    if (!hasIdParam) {
      return COLLECTION_MODE;
    }

    if (!hasRelationParam && !hasRelatedParam) {
      return SINGLE_MODE;
    }

    if (hasRelationParam) {
      return RELATION_MODE;
    }

    if (hasRelatedParam) {
      return RELATED_MODE;
    }

    throw Kapow(400, 'Unable to determine mode based on `request.params` keys.');
  }

  /**
    Creates a new instance of a model.

    @returns {Promise(Bookshelf.Model)} Newly created instance of the Model.
  */
  create (request) {
    const {store, method, model} = this;
    const data = request.body.data;
    if (data && data.id) {
      return store.byId(model, data.id)
        .then(throwIfModel)
        .then(function() {
          return store.create(model, method, data);
        }
      );
    } else {
      return store.create(model, method, data);
    }
  }

  /**
    Queries the store for matching models.

    @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)}
  */
  read (request) {
    const {store, model} = this;
    const query = this.query(request);
    const params = request.params;
    const id = params.id;
    if (id) {
      // FIXME: this could collide with filter[id]=#
      query.filter.id = id;
      query.singleResult = true;
    }
    return store.read(model, query);
  }

  readRelated (request) {
    const {store, model} = this;
    const id = request.params.id;
    const relation = request.params.related;
    const query = this.query(request);
    return store.readRelated(model, id, relation, query);
  }

  readRelation (request) {
    const {store, model} = this;
    const id = request.params.id;
    const relation = request.params.relation;
    const query = this.query(request);
    return store.readRelation(model, id, relation, query);
  }

  /**
    Edits a model.

    @returns {Promise(Bookshelf.Model)}
  */
  update (request) {
    const {store, method, model} = this;
    const id = request.params.id;
    const relation = request.params.relation;

    var data = request.body.data;

    if (relation) {
      this.config.relationOnly = true;
      data = {
        id: id,
        type: store.type(model),
        links: {}
      };
      data.links[relation] = {linkage: request.body.data};
    }

    return store.byId(model, id, [relation]).
      then(throwIfNoModel).
      then(function (model) {
        if (request.method !== 'PATCH') {
          // FIXME: This will break heterogeneous relations
          var relationType = data.links[relation].linkage[0].type;
          var existingRels = model.toJSON()[relation].map(function(rel) {
            return {
              id: String(rel.id),
              type: relationType
            };
          });

          if (request.method === 'POST') {
            data.links[relation].linkage = _.uniq(data.links[relation].linkage.concat(existingRels));
          }

          if (request.method === 'DELETE') {
            data.links[relation].linkage = _.reject(existingRels, function(rel) {
              return _.findWhere(data.links[relation].linkage, rel);
            });
          }
        }

        return store.update(model, method, data);
      }).catch(function(e) {
        // FIXME: This may only work for SQLITE3, but tries to be general
        if (e.message.toLowerCase().indexOf('null') !== -1) {
          Kapow.wrap(e, 409);
        }
        throw e;
      });
  }

  /**
    Deletes a model.

    @returns {Promise(Bookshelf.Model)}
  */
  destroy (request) {
    const {method, store, model} = this;
    const id = request.params.id;

    return store.byId(model, id).then(function (model) {
      if (model) {
        return store.destroy(model, method);
      }
    });
  }

}

export default RequestHandler;
