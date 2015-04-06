const _ = require('lodash');
const validate = require('./lib/validate');
const handle = require('./lib/handle');

/**
  Provides methods for generating request handling functions that can
  be used by any node http server.
*/
class Controller {

  /**
    The constructor.

    @constructs Controller
    @param {Object} opts - opts.adapter: An endpoints adapter
    @param {Object} opts - opts.model: A model compatible with the adapter.
    @param {Object} opts - opts.validators: An array of validating methods.
    @param {Object} opts - opts.allowClientGeneratedIds: boolean indicating this
  */
  constructor (opts={}) {
    if (!opts.adapter) {
      throw new Error('No adapter specified.');
    }
    if (!opts.model) {
      throw new Error('No model specified.');
    }
    var config = this.config = _.extend({
      validators: [],
      allowClientGeneratedIds: false,
      allowToManyFullReplacement: true
    }, opts);

    this._adapter = new config.adapter({
      model: config.model
    });
  }

  get capabilities() {
    // TODO: include this.config?
    return {
      filters: this._adapter.filters(),
      includes: this._adapter.relations()
    };
  }

  /**
    Used for generating CRUD (create, read, update, destroy) methods.

    @param {String} method - The name of the function to be created.
    @returns {Function} - function (req, res) { } (node http compatible request handler)
  */
  static method (method) {
    return function (opts) {
      var config = _.extend({
        method: method,
        include: [],
        filter: {},
        fields: {},
        sort: [],
        schema: {},
      }, this.config, opts);
      var validationFailures = validate(method, config, this._adapter);
      if (validationFailures.length) {
        throw new Error(validationFailures.join('\n'));
      }
      return handle(config, this._adapter);
    };
  }

  static extend (props={}) {
    return class Controller extends this {
      constructor(opts={}) {
        super(_.extend({}, props, opts));
      }
    };
  }

}

/**
  Returns a request handling function customized to handle create requests.
*/
Controller.prototype.create = Controller.method('create');

/**
  Returns a request handling function customized to handle read requests.
*/
Controller.prototype.read = Controller.method('read');

/**
  Returns a request handling function customized to handle update requests.
*/
Controller.prototype.update = Controller.method('update');

/**
  Returns a request handling function customized to handle destroy requests.
*/
Controller.prototype.destroy = Controller.method('destroy');

module.exports = Controller;
