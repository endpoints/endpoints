import _ from 'lodash';

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
    @param {Endpoints.Store} store
  */
  constructor (config={}) {
    this.config = config;
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
        !request.params.relation &&
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
    Given a request, build a query object.

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
    Given a request, create a new record in the underlying store.

    @returns {Promise(Bookshelf.Model)} Newly created instance of the model.
  */
  create (request) {
    const {store, model} = this;
    const data = request.body.data;
    if (data && data.id) {
      return store.byId(model, data.id)
        .then(throwIfModel)
        .then(function() {
          return store.create(model, data);
        }
      );
    } else {
      return store.create(model, data);
    }
  }

  createRelation (request) {
    const store = this.store;
    const relationName = request.params.relation;
    return store.byId(this.model, request.params.id, [relationName])
      .then(throwIfNoModel)
      .then((model) => {
        return store.createRelation(model, relationName, request.body.data);
      });
  }

  /**
    Queries the store for matching models.

    @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)}
  */
  read (request) {
    const id = request.params.id;
    const query = this.query(request);
    if (id) {
      // FIXME: this could collide with filter[id]=#
      query.filter.id = id;
      query.singleResult = true;
    }
    return this.store.read(this.model, query);
  }

  readRelated (request) {
    const id = request.params.id;
    const query = this.query(request);
    const relatedName = request.params.related;
    return this.store.readRelated(this.model, id, relatedName, query);
  }

  readRelation (request) {
    const id = request.params.id;
    const query = this.query(request);
    const relationName = request.params.relation;
    return this.store.readRelation(this.model, id, relationName, query);
  }

  update (request) {
    const store = this.store;
    return store.byId(this.model, request.params.id).
      then(throwIfNoModel).
      then((model) => {
        return store.update(model, request.body.data);
      });
  }

  updateRelation (request) {
    const store = this.store;
    const relationName = request.params.relation;
    return store.byId(this.model, request.params.id, [relationName])
      .then(throwIfNoModel)
      .then((model) => {
        return store.update(model, {
          links: {
            [relationName]: {
              linkage: request.body.data
            }
          }
        });
      });
  }

  /**
    Deletes a model.

    @returns {Promise(Bookshelf.Model)}
  */
  destroy (request) {
    const store = this.store;
    const id = request.params.id;
    return store.byId(this.model, id).then((model) => {
      if (model) {
        return store.destroy(model);
      }
    });
  }

  destroyRelation (request) {
    const store = this.store;
    const relationName = request.params.relation;
    return store.byId(this.model, request.params.id, [relationName])
      .then(throwIfNoModel)
      .then((model) => {
        return store.destroyRelation(model, {
          links: {
            [relationName]: {
              linkage: request.body.data
            }
          }
        });
      });
  }

}

export default RequestHandler;
