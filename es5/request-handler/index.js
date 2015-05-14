'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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

/**
  Provides methods for pulling out json-api relevant data from
  express or hapi request instances. Also provides route level
  validation.
*/

var RequestHandler = (function () {

  /**
    The constructor.
     @constructs RequestHandler
    @param {Endpoints.Store} store
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
      !request.params.relation && !this.config.allowClientGeneratedIds;

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
    Given a request, build a query object.
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
    Given a request, create a new record in the underlying store.
     @returns {Promise(Bookshelf.Model)} Newly created instance of the model.
  */

  RequestHandler.prototype.create = function create(request) {
    var store = this.store;
    var model = this.model;

    var data = request.body.data;
    if (data && data.id) {
      return store.byId(model, data.id).then(_libThrow_if_model2['default']).then(function () {
        return store.create(model, data);
      });
    } else {
      return store.create(model, data);
    }
  };

  RequestHandler.prototype.createRelation = function createRelation(request) {
    var store = this.store;
    var relationName = request.params.relation;
    return store.byId(this.model, request.params.id, [relationName]).then(_libThrow_if_no_model2['default']).then(function (model) {
      return store.createRelation(model, relationName, request.body.data);
    });
  };

  /**
    Queries the store for matching models.
     @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)}
  */

  RequestHandler.prototype.read = function read(request) {
    var id = request.params.id;
    var query = this.query(request);
    if (id) {
      // FIXME: this could collide with filter[id]=#
      query.filter.id = id;
      query.singleResult = true;
    }
    return this.store.read(this.model, query);
  };

  RequestHandler.prototype.readRelated = function readRelated(request) {
    var id = request.params.id;
    var query = this.query(request);
    var relatedName = request.params.related;
    return this.store.readRelated(this.model, id, relatedName, query);
  };

  RequestHandler.prototype.readRelation = function readRelation(request) {
    var id = request.params.id;
    var query = this.query(request);
    var relationName = request.params.relation;
    return this.store.readRelation(this.model, id, relationName, query);
  };

  RequestHandler.prototype.update = function update(request) {
    var store = this.store;
    return store.byId(this.model, request.params.id).then(_libThrow_if_no_model2['default']).then(function (model) {
      return store.update(model, request.body.data);
    });
  };

  RequestHandler.prototype.updateRelation = function updateRelation(request) {
    var store = this.store;
    var relationName = request.params.relation;
    return store.byId(this.model, request.params.id, [relationName]).then(_libThrow_if_no_model2['default']).then(function (model) {
      var _links;

      return store.update(model, {
        links: (_links = {}, _links[relationName] = {
          linkage: request.body.data
        }, _links)
      });
    });
  };

  /**
    Deletes a model.
     @returns {Promise(Bookshelf.Model)}
  */

  RequestHandler.prototype.destroy = function destroy(request) {
    var store = this.store;
    var id = request.params.id;
    return store.byId(this.model, id).then(function (model) {
      if (model) {
        return store.destroy(model);
      }
    });
  };

  RequestHandler.prototype.destroyRelation = function destroyRelation(request) {
    var store = this.store;
    var relationName = request.params.relation;
    return store.byId(this.model, request.params.id, [relationName]).then(_libThrow_if_no_model2['default']).then(function (model) {
      var _links2;

      return store.destroyRelation(model, {
        links: (_links2 = {}, _links2[relationName] = {
          linkage: request.body.data
        }, _links2)
      });
    });
  };

  _createClass(RequestHandler, [{
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