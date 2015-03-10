const _ = require('lodash');
const Kapow = require('kapow');

const throwIfModel = require('./lib/throw_if_model');
const throwIfNoModel = require('./lib/throw_if_no_model');
const verifyAccept = require('./lib/verify_accept');
const verifyContentType = require('./lib/verify_content_type');
const verifyDataObject = require('./lib/verify_data_object');
const splitStringProps = require('./lib/split_string_props');

function Request (request, config, source) {
  var params = request.params = request.params || {};
  var body = request.body = request.body || {};
  request.query = request.query || {};

  this.request = request;
  this.config = _.cloneDeep(config);
  this.source = source;

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

Request.prototype.validate = function () {
  var err;
  var request = this.request;
  var validators = [verifyAccept];

  if (this.data()) {
    validators = validators.concat([verifyContentType, verifyDataObject]);
  }
  var endpoint = {
    id: request.params.id,
    typeName: this.typeName()
  };
  for (var validate in validators) {
    err = validators[validate](request, endpoint);
    if (err) {
      break;
    }
  }
  return err;
};

Request.prototype.data = function () {
  return this.request.body.data;
};

Request.prototype.relation = function () {
  return this.params.relation;
};

Request.prototype.method = function () {
  return this.config.method;
};

Request.prototype.typeName = function () {
  return this.source.typeName();
};

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
