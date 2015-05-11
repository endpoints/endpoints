import _ from 'lodash';
import validate from './lib/validate';
import handle from './lib/handle';
import singleSlashJoin from './lib/single_slash_join';

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
    @param {Object} config - config.format: An endpoints format adapter.
    @param {Object} config - config.store: An endpoints store adapter.
    @param {Object} config - config.baseUrl: A base url for link generation.
    @param {Object} config - config.basePath: A base path for link generation.
    @param {Object} config - config.model: A model compatible with the store adapter.
    @param {Object} config - config.validators: An array of validating methods.
    @param {Object} config - opts.allowClientGeneratedIds: boolean indicating this
  */
  constructor (config={}) {
    if (!config.format) {
      throw new Error('No format specified.');
    }
    if (!config.store) {
      throw new Error('No store specified.');
    }
    if (!config.model) {
      throw new Error('No model specified.');
    }
    if (!config.baseUrl) {
      throw new Error('No baseUrl specified for URL generation.');
    }
    if (!config.basePath) {
      throw new Error('No basePath specified for URL generation.');
    }
    this.config = _.extend({
      validators: [],
      allowClientGeneratedIds: false,
      allowToManyFullReplacement: true,
    }, config);
  }

  get capabilities() {
    const {store, model} = this.config;
    // TODO: include this.config?
    return {
      filters: Object.keys(store.filters(model)),
      includes: store.allRelations(model),
    };
  }

  get baseUrl() {
    return this.config.baseUrl;
  }

  get basePath() {
    return this.config.basePath;
  }

  get url() {
    return singleSlashJoin([this.baseUrl, this.basePath]);
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
    // TODO: fix this gross passing of the url
    return handle(config, this.url);
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
