const COLLECTION_MODE = 'collection';
const SINGLE_MODE = 'single';
const RELATION_MODE = 'relation';
const RELATED_MODE = 'related';

const _ = require('lodash');
const Kapow = require('kapow');

const throwIfModel = require('./lib/throw_if_model');
const throwIfNoModel = require('./lib/throw_if_no_model');
const verifyAccept = require('./lib/verify_accept');
const verifyContentType = require('./lib/verify_content_type');
const verifyDataObject = require('./lib/verify_data_object');
const splitStringProps = require('./lib/split_string_props');
const verifyClientGeneratedId = require('./lib/verify_client_generated_id');
const verifyFullReplacement = require('./lib/verify_full_replacement');

/**
  Provides methods for pulling out json-api relevant data from
  express or hapi request instances. Also provides route level
  validation.
*/
class RequestHandler {

  /**
    The constructor.

    @constructs RequestHandler
    @param {Endpoints.Adapter} adapter
  */
  constructor (adapter, config={}) {
    this.config = config;
    this.adapter = adapter;
    this.method = config.method;

    // this used to happen in the configureController step
    // TODO: is this even needed? i believe we're only using
    // it to generate the location header response for creation
    // which is brittle and invalid anyway.
    config.typeName = adapter.typeName();
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
    var config = _.cloneDeep(this.config);

    var query = request.query;
    var include = query.include;
    var filter = query.filter;
    var fields = query.fields;
    var sort = query.sort;
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
    var hasIdParam = !!request.params.id;
    var hasRelationParam = !!request.params.relation;
    var hasRelatedParam = !!request.params.related;

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
    var adapter = this.adapter;
    var method = this.method;
    var data = request.body.data;

    if (data && data.id) {
      return adapter.byId(data.id)
        .then(throwIfModel)
        .then(function() {
          return adapter.create(method, data);
        }
      );
    } else {
      return adapter.create(method, data);
    }
  }

  /**
    Queries the adapter for matching models.

    @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)}
  */
  read (request) {
    var adapter = this.adapter;
    var query = this.query(request);
    var mode = this.mode(request);

    var params = request.params;
    var id = params.id;

    var related, findRelated;

    if (mode === RELATED_MODE || mode === RELATION_MODE) {
      related = params.related || params.relation;
      findRelated = adapter.related.bind(adapter, query, related, mode);
      return adapter.byId(id, related).then(throwIfNoModel).then(findRelated);
    }

    if (id) {
      // FIXME: this could collide with filter[id]=#
      query.filter.id = id;
    }
    return adapter.read(query, mode);
  }

  /**
    Edits a model.

    @returns {Promise(Bookshelf.Model)}
  */
  update (request) {
    var adapter = this.adapter;
    var method = this.method;
    var id = request.params.id;
    var relation = request.params.relation;
    var data = request.body.data;

    if (relation) {
      this.config.relationOnly = true;
      data = {
        id: id,
        type: adapter.typeName(),
        links: {}
      };
      data.links[relation] = {linkage: request.body.data};
    }

    return adapter.byId(id, [relation]).
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

        return adapter.update(model, method, data);
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
    var method = this.method;
    var adapter = this.adapter;
    var id = request.params.id;

    return adapter.byId(id).then(function (model) {
      if (model) {
        return adapter.destroy(model, method);
      }
    });
  }

}

module.exports = RequestHandler;
