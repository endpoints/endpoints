const _ = require('lodash');
const Kapow = require('kapow');

const throwIfModel = require('./lib/throw_if_model');
const throwIfNoModel = require('./lib/throw_if_no_model');
const verifyAccept = require('./lib/verify_accept');
const verifyContentType = require('./lib/verify_content_type');
const verifyDataObject = require('./lib/verify_data_object');
const splitStringProps = require('./lib/split_string_props');

/*
  Creates a new instance of Request.

  @constructor
  @param {Object} request - The request object.
  @param {Object} config - The config from the controller.
  @param {Endpoints.Adapter} adapter
*/
function Request (request, config, adapter) {
  var params = request.params = request.params || {};
  var body = request.body = request.body || {};
  request.query = request.query || {};

  this.request = request;
  this.config = _.cloneDeep(config);
  this.adapter = adapter;
  this.typeName = adapter.typeName();
  this.schema = config.schema || {};
  this.validators = config.validators;

  // this used to happen in the configureController step
  // TODO: is this even needed? i believe we're only using
  // it to generate the location header response for creation
  // which is brittle and invalid anyway.
  config.typeName = adapter.typeName();

  var requestData;
  if (config.method === 'update' && params.relation) {
    requestData = {
      type: adapter.typeName(),
      links: {}
    };
    requestData.links[params.relation] = body.data;
    body.data = requestData;
    config.relationOnly = true;
  }
}

/*
  A function that, given a request, validates the request.

  @returns {object} An object containing errors, if any.
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

/*
  A convenience method for accessing the data object in a request body.

  @returns {Object} An collection or element.
*/
Request.prototype.data = function () {
  return this.request.body.data;
};

/*
  A convenience method for accessing the relation object
  inside the params object on a request.

  @returns {Array} The params.relation on a request object.
*/
Request.prototype.relation = function () {
  return this.params.relation;
};

/*
  A convenience method for retrieving the method from the request object.

  @returns {String} The name of the method (create, read, update, destroy).
*/
Request.prototype.method = function () {
  return this.config.method;
};


/*
  A convenience method for accessing the typeName of an adapter's model.

  @returns {String} The name of the type of the model.
 */
Request.prototype.typeName = function () {
  return this.adapter.typeName();
};

/*
  Builds a query object to be passed to Endpoints.Adapter#read.

  @returns {Object} The query object on a request.
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

/*
  Creates a new instance of a model.

  @returns {Promise(Bookshelf.Model)} Newly created instance of the Model.
*/
Request.prototype.create = function () {
  var adapter = this.adapter;
  var method = this.method();
  var data = this.data();

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
};

/*
  Queries the adapter for matching models.

  @returns {Promise(Bookshelf.Model|Bookshelf.Collection)}
*/
Request.prototype.read = function () {
  var adapter = this.adapter;
  var query = this.query();

  var params = this.request.params;
  var id = params.id;
  var relation = params.relation;

  var findRelated;
  if (relation) {
    findRelated = adapter.related.bind(adapter, query, relation);
    return adapter.byId(id, relation).then(throwIfNoModel).then(findRelated);
  }

  if (id) {
    // FIXME: this could collide with filter[id]=#
    query.filter.id = id;
  }
  return adapter.read(query);
};

/*
  Edits a model.

  @returns {Promise(Bookshelf.Model)}
*/
Request.prototype.update = function () {
  var adapter = this.adapter;
  var method = this.method();
  var id = this.request.params.id;
  var data = this.data();

  return adapter.byId(id).
    then(throwIfNoModel).
    then(function (model) {
      return adapter.update(model, method, data);
    }).catch(function(e) {
      // This may only work for SQLITE3, but tries to be general
      if (e.message.toLowerCase().indexOf('null') !== -1) {
        Kapow.wrap(e, 409);
      }
      throw e;
    });
};

/*
  Deletes a model.

  @returns {Promise(Bookshelf.Model)}
*/
Request.prototype.destroy = function () {
  var method = this.method();
  var adapter = this.adapter;
  var id = this.request.params.id;

  return adapter.byId(id).then(function (model) {
    if (model) {
      return adapter.destroy(model, method);
    }
  });
};

module.exports = Request;
