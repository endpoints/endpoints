import _ from 'lodash';
import validate from './lib/validate';
import handle from './lib/handle';

/**
  Provides methods for generating request handling functions that can
  be used by any node http server.
*/
class Controller {

  static extend (props={}) {
    return class Controller extends this {
      constructor(opts={}) {
        super(_.extend({}, props, opts));
      }
    };
  }

  /**
    The constructor.

    @constructs Controller
    @param {Object} opts - opts.format: An endpoints format adapter.
    @param {Object} opts - opts.store: An endpoints store adapter.
    @param {Object} opts - opts.model: A model compatible with the store adapter.
    @param {Object} opts - opts.validators: An array of validating methods.
    @param {Object} opts - opts.allowClientGeneratedIds: boolean indicating this
  */
  constructor (opts={}) {
    if (!opts.format) {
      throw new Error('No format specified.');
    }
    if (!opts.store) {
      throw new Error('No store specified.');
    }
    if (!opts.model) {
      throw new Error('No model specified.');
    }
    this.config = _.extend({
      validators: [],
      allowClientGeneratedIds: false,
      allowToManyFullReplacement: true
    }, opts);
  }

  get capabilities() {
    // TODO: include this.config?
    return {
      filters: this.store.filters(this.model),
      includes: this.store.allRelations(this.model),
    };
  }

  /**
    Used for generating CRUD methods.

    @param {String} method - The name of the function to be created.
    @param {String} opts - The name of the function to be created.
    @returns {Function} - function (req, res) { } (node http compatible request handler)
  */
  method (method, opts) {
    var config = _.extend({
      method: method,
      include: [],
      filter: {},
      fields: {},
      sort: [],
      schema: {},
    }, this.config, opts);
    var validationFailures = validate(method, config);
    if (validationFailures.length) {
      throw new Error(validationFailures.join('\n'));
    }
    return handle(config);
  }

  create (opts) {
    return this.method('create', opts);
  }

  read (opts) {
    return this.method('read', opts);
  }

  readRelated (opts) {
    return this.method('readRelated', opts);
  }

  readRelation (opts) {
    return this.method('readRelation', opts);
  }

  update (opts) {
    return this.method('update', opts);
  }

  destroy (opts) {
    return this.method('destroy', opts);
  }

}

export default Controller;
