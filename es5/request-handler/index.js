'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

var _libThrow_if_model = require('./lib/throw_if_model');

var _libThrow_if_model2 = _interopRequireDefault(_libThrow_if_model);

var _libThrow_if_no_model = require('./lib/throw_if_no_model');

var _libThrow_if_no_model2 = _interopRequireDefault(_libThrow_if_no_model);

var _libVerify_accept = require('./lib/verify_accept');

var _libVerify_accept2 = _interopRequireDefault(_libVerify_accept);

var _libVerify_content_type = require('./lib/verify_content_type');

var _libVerify_content_type2 = _interopRequireDefault(_libVerify_content_type);

var _libVerify_data_object = require('./lib/verify_data_object');

var _libVerify_data_object2 = _interopRequireDefault(_libVerify_data_object);

var _libSplit_string_props = require('./lib/split_string_props');

var _libSplit_string_props2 = _interopRequireDefault(_libSplit_string_props);

var _libVerify_client_generated_id = require('./lib/verify_client_generated_id');

var _libVerify_client_generated_id2 = _interopRequireDefault(_libVerify_client_generated_id);

var _libVerify_full_replacement = require('./lib/verify_full_replacement');

var _libVerify_full_replacement2 = _interopRequireDefault(_libVerify_full_replacement);

var COLLECTION_MODE = 'collection';
var SINGLE_MODE = 'single';
var RELATION_MODE = 'relation';
var RELATED_MODE = 'related';

/**
  Provides methods for pulling out json-api relevant data from
  express or hapi request instances. Also provides route level
  validation.
*/

var RequestHandler = (function () {

  /**
    The constructor.
     @constructs RequestHandler
    @param {Endpoints.Store.*} store
  */

  function RequestHandler() {
    var config = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, RequestHandler);

    this.config = config;
  }

  /**
    A function that, given a request, validates the request.
     @returns {Object} An object containing errors, if any.
  */

  RequestHandler.prototype.validate = function validate(request) {

    var err;
    var validators = [_libVerify_accept2['default']];

    if (request.body && request.body.data) {
      var clientIdCheck = request.method === 'POST' &&
      // posting to a relation endpoint is for appending
      // relationships and and such is allowed (must have, really)
      // ids
      this.mode(request) !== RELATION_MODE && !this.config.allowClientGeneratedIds;

      // this applies for both "base" and relation endpoints
      var fullReplacementCheck = request.method === 'PATCH' && !this.config.allowToManyFullReplacement;

      if (clientIdCheck) {
        validators.push(_libVerify_client_generated_id2['default']);
      }
      if (fullReplacementCheck) {
        validators.push(_libVerify_full_replacement2['default']);
      }
      validators = validators.concat([_libVerify_content_type2['default'], _libVerify_data_object2['default']]);
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
  };

  /**
    Builds a query object to be passed to Endpoints.Adapter#read.
     @returns {Object} The query object on a request.
   */

  RequestHandler.prototype.query = function query(request) {
    // bits down the chain can mutate this config
    // on a per-request basis, so we need to clone
    var config = _lodash2['default'].cloneDeep(_lodash2['default'].omit(this.config, ['store', 'model']));
    var _request$query = request.query;
    var include = _request$query.include;
    var filter = _request$query.filter;
    var fields = _request$query.fields;
    var sort = _request$query.sort;

    return {
      include: include ? include.split(',') : config.include,
      filter: filter ? _libSplit_string_props2['default'](filter) : config.filter,
      fields: fields ? _libSplit_string_props2['default'](fields) : config.fields,
      sort: sort ? sort.split(',') : config.sort
    };
  };

  /**
    Determines mode based on what request.params are available.
     @returns {String} the read mode
  */

  RequestHandler.prototype.mode = function mode(request) {
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

    throw _kapow2['default'](400, 'Unable to determine mode based on `request.params` keys.');
  };

  /**
    Creates a new instance of a model.
     @returns {Promise(Bookshelf.Model)} Newly created instance of the Model.
  */

  RequestHandler.prototype.create = function create(request) {
    var store = this.store;
    var method = this.method;
    var model = this.model;

    var data = request.body.data;
    if (data && data.id) {
      return store.byId(model, data.id).then(_libThrow_if_model2['default']).then(function () {
        return store.create(model, method, data);
      });
    } else {
      return store.create(model, method, data);
    }
  };

  /**
    Queries the store for matching models.
     @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)}
  */

  RequestHandler.prototype.read = function read(request) {
    var store = this.store;
    var model = this.model;

    var query = this.query(request);
    var params = request.params;
    var id = params.id;
    if (id) {
      // FIXME: this could collide with filter[id]=#
      query.filter.id = id;
      query.singleResult = true;
    }
    return store.read(model, query);
  };

  RequestHandler.prototype.readRelated = function readRelated(request) {
    var store = this.store;
    var model = this.model;

    var id = request.params.id;
    var relation = request.params.related;
    var query = this.query(request);
    return store.readRelated(model, id, relation, query);
  };

  RequestHandler.prototype.readRelation = function readRelation(request) {
    var store = this.store;
    var model = this.model;

    var id = request.params.id;
    var relation = request.params.relation;
    var query = this.query(request);
    return store.readRelation(model, id, relation, query);
  };

  /**
    Edits a model.
     @returns {Promise(Bookshelf.Model)}
  */

  RequestHandler.prototype.update = function update(request) {
    var store = this.store;
    var method = this.method;
    var model = this.model;

    var id = request.params.id;
    var relation = request.params.relation;

    var data = request.body.data;

    if (relation) {
      this.config.relationOnly = true;
      data = {
        id: id,
        type: store.type(model),
        links: {}
      };
      data.links[relation] = { linkage: request.body.data };
    }

    return store.byId(model, id, [relation]).then(_libThrow_if_no_model2['default']).then(function (model) {
      if (request.method !== 'PATCH') {
        // FIXME: This will break heterogeneous relations
        var relationType = data.links[relation].linkage[0].type;
        var existingRels = model.toJSON()[relation].map(function (rel) {
          return {
            id: String(rel.id),
            type: relationType
          };
        });

        if (request.method === 'POST') {
          data.links[relation].linkage = _lodash2['default'].uniq(data.links[relation].linkage.concat(existingRels));
        }

        if (request.method === 'DELETE') {
          data.links[relation].linkage = _lodash2['default'].reject(existingRels, function (rel) {
            return _lodash2['default'].findWhere(data.links[relation].linkage, rel);
          });
        }
      }

      return store.update(model, method, data);
    })['catch'](function (e) {
      // FIXME: This may only work for SQLITE3, but tries to be general
      if (e.message.toLowerCase().indexOf('null') !== -1) {
        _kapow2['default'].wrap(e, 409);
      }
      throw e;
    });
  };

  /**
    Deletes a model.
     @returns {Promise(Bookshelf.Model)}
  */

  RequestHandler.prototype.destroy = function destroy(request) {
    var method = this.method;
    var store = this.store;
    var model = this.model;

    var id = request.params.id;

    return store.byId(model, id).then(function (model) {
      if (model) {
        return store.destroy(model, method);
      }
    });
  };

  _createClass(RequestHandler, [{
    key: 'method',
    get: function () {
      return this.config.method;
    }
  }, {
    key: 'store',
    get: function () {
      return this.config.store;
    }
  }, {
    key: 'model',
    get: function () {
      return this.config.model;
    }
  }]);

  return RequestHandler;
})();

exports['default'] = RequestHandler;
module.exports = exports['default'];