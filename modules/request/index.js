const _ = require('lodash');
const Kapow = require('kapow');

const throwIfModel = require('./lib/throw_if_model');
const throwIfNoModel = require('./lib/throw_if_no_model');
const verifyAccept = require('./lib/verify_accept');
const verifyContentType = require('./lib/verify_content_type');
const verifyDataObject = require('./lib/verify_data_object');
const splitStringProps = require('./lib/split_string_props');

/**
 * Creates a new instance of Request.
 *
 * @constructor
 * @param {Object} request - The request object from express.
 * @param {Object} config - A object containing customization keys.
 * @param {Source} source - The data source.
 * @returns {Request} A new instance of Request.
 */
function Request (request, config, source) {
  var params = request.params = request.params || {};
  var body = request.body = request.body || {};
  request.query = request.query || {};

  this.request = request;
  this.config = _.cloneDeep(config);
  this.source = source;
  this.typeName = source.typeName();
  this.schema = config.schema || {};
  this.validators = config.validators;

  // this used to happen in the configureController step
  config.typeName = source.typeName();

  var requestData;
  if (config.method === 'update' && params.relation) {
    requestData = {
      type: source.typeName(),
      links: {}
    };
    requestData.links[params.relation] = body.data;
    body.data = requestData;
    config.relationOnly = true;
  }
}

/**
 * A function that, given a request, validates the request.
 *
 * @returns {object} An object containing errors, if any.
 */
Request.prototype.validate = function () {
  var err;
  var request = this.request;
  var validators = [verifyAccept];

  if (this.data()) {
    validators = validators.concat([verifyContentType, verifyDataObject]);
  }

  // does this.validators needs a better name? controllerValidator, userValidators?
  validators = validators.concat(this.validators);

  for (var validate in validators) {
    err = validators[validate](request, this);
    if (err) {
      break;
    }
  }
  return err;
};

/**
 * A convenience method for accessing the data object in a
 * request body.
 *
 * @returns {Object} An collection or element.
 */
Request.prototype.data = function () {
  return this.request.body.data;
};

/**
 * A convenience method for accessing the relation object
 * inside the params object on a request.
 *
 * @returns {Object} The params.relation on a request object.
 */
Request.prototype.relation = function () {
  return this.params.relation;
};

/**
 * A convenience method for retrieving the method from the
 * request object.
 *
 * @returns {String} The name of the method (create, read, update, destroy).
 */
Request.prototype.method = function () {
  return this.config.method;
};


/**
 * A convenience method for accessing the string typeName of a Source model.
 *
 * @returns {Source#typeName} The name of the type of the model from the Source.
 */
Request.prototype.typeName = function () {
  return this.source.typeName();
};

/**
 * A convenience method for accessing the query object
 * on a request.
 *
 * @returns {Object} The query object on a request.
 */
Request.prototype.query = function () {
  var query = this.request.query;
  var config = this.config;
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
};

/**
 * Creates a new instance of a bookshelf Model.
 *
 * @returns {Promise.Bookshelf.Model} Newly created instance of the Model.
 */
Request.prototype.create = function () {
  var source = this.source;
  var method = this.method();
  var data = this.data();

  if (data && data.id) {
    return source.byId(data.id)
      .then(throwIfModel)
      .then(function() {
        return source.create(method, data);
      }
    );
  } else {
    return source.create(method, data);
  }
};

/**
 * Requests data for one or more elements.
 *
 * @returns {Promise.Bookshelf.Model} Requested Bookshelf.Model or Bookshelf.Collection.
 */
Request.prototype.read = function () {
  var source = this.source;
  var query = this.query();

  var params = this.request.params;
  var id = params.id;
  var relation = params.relation;

  var findRelated;
  if (relation) {
    findRelated = source.related.bind(source, query, relation);
    return source.byId(id, relation).then(throwIfNoModel).then(findRelated);
  }

  if (id) {
    // FIXME: this could collide with filter[id]=#
    query.filter.id = id;
  }
  return source.read(query);
};

/**
 * Edits a single element by changing values for one or more attributes.
 *
 * @returns {Bookshelf.Model}
 */
Request.prototype.update = function () {
  var source = this.source;
  var method = this.method();
  var id = this.request.params.id;
  var data = this.data();

  return source.byId(id).
    then(throwIfNoModel).
    then(function (model) {
      return source.update(model, method, data);
    }).catch(function(e) {
      // This may only work for SQLITE3, but tries to be general
      if (e.message.toLowerCase().indexOf('null') !== -1) {
        Kapow.wrap(e, 409);
      }
      throw e;
    });
};

/**
 * Deletes an element.
 *
 * @returns {Bookshelf.Model} Newly deleted / empty Bookshelf.Model.
 */
Request.prototype.destroy = function () {
  var method = this.method();
  var source = this.source;
  var id = this.request.params.id;

  return source.byId(id).then(function (model) {
    if (model) {
      return source.destroy(model, method);
    }
  });
};

module.exports = Request;
