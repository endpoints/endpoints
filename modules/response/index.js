const Kapow = require('kapow');

function Response (opts) {
  if (!opts) {
    opts = {};
  }
  if (opts.formatter) {
    this.formatter = opts.formatter;
  }
  if (opts.send) {
    this.send = opts.send;
  }
}

Response.prototype.formatter = require('../formatter-jsonapi');
Response.prototype.error = require('./lib/error');
Response.prototype.send = require('./lib/send');

Response.prototype.create = function (data, opts) {
  var formatter = this.formatter;
  return {
    code: '201',
    data: formatter(data, {
      singleResult: true
    }),
    headers: {
      location: '/' + opts.typeName + '/' + data.id
    }
  };
};

Response.prototype.read = function (data, opts) {
  var formatter = this.formatter;
  if (!data || data.length === 0 && data.singleResult) {
    return this.error(Kapow(404, 'Resource not found.'));
  }
  return {
    code: '200',
    data: formatter(data, {
      singleResult: data.singleResult,
      relations: data.relations,
      typeName: opts.typeName
    })
  };
};

Response.prototype.update = function (data, opts) {
  var formatter = this.formatter;
  if (data && !opts.relationOnly) {
    return {
      code: '200',
      data: formatter(data, opts)
    };
  }
  return {
    code: '204',
    data: null
  };
};

Response.prototype.destroy = function (data, opts) {
  return {
    code: '204',
    data: null
  };
};

module.exports = Response;
