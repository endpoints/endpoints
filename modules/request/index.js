const _ = require('lodash');

const throwIfModel = require('./lib/throw_if_model');
const throwIfNoModel = require('./lib/throw_if_no_model');
const verifyAccept = require('./lib/verify_accept');
const verifyContentType = require('./lib/verify_content_type');
const verifyDataObject = require('./lib/verify_data_object');
const splitStringProps = require('./lib/split_string_props');

function Request (request, source, opts) {
  this.request = request;
  this.source = source;
  this.opts = _.cloneDeep(opts);
  this.params = request.params || {};
  this.query = request.query || {};
  this.body = request.body || {};
};

Request.prototype.data = function () {
  return this.body.data;
};

Request.prototype.id = function () {
  return this.params.id;
}

Request.prototype.relation = function () {
  return this.params.relation;
};

Request.prototype.method = function () {
  return this.opts.method;
};

Request.prototype.include = function () {
  var include = this.query.include;
  return include ? include.split(',') : this.opts.include;
};

Request.prototype.filter = function () {
  var filter = this.query.filter;
  return filter ? splitStringProps(filter) : this.opts.filter;
};

Request.prototype.fields = function () {
  var filter = this.query.fields;
  return fields ? splitStringProps(fields) : this.opts.fields;
};

Request.prototype.sort = function () {
  var sort = this.query.sort;
  return sort ? sort.split(',') : this.opts.sort;
};

Request.prototype.params = function () {
  return {
    include: this.include(),
    filter: this.filter(),
    fields: this.fields(),
    sort: this.sort()
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
        return source.create(method, request.body.data);
      }
    );
  } else {
    return source.create(method, request.body.data);
  }
};

Request.prototype.read = function () {
  var source = this.source;
  var relation = this.relation();
  var params = this.params();
  var id = this.id();

  var findRelated;
  if (relation) {
    findRelated = source.related.bind(source, params, relation);
    return source.byId(id, relation).then(throwIfNoModel).then(findRelated);
  }

  if (id) {
    // FIXME: this could collide with filter[id]=#
    params.filter.id = id;
  }
  return source.read(params);
};

Request.prototype.update = function () {
  var source = this.source;
  var method = this.method();
  var id = this.id();
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
};

Request.prototype.destroy = function () {
  var method = this.method();
  var source = this.source;
  var id = this.id();

  return source.byId(id).then(function (model) {
    if (model) {
      return source.destroy(model, method);
    }
  });
};

module.exports = Request;
