const _ = require('lodash');

const configureController = require('./lib/configure_controller');
const validateController = require('./lib/validate_controller');

const METHODS = ['create', 'read', 'readRelation', 'update', 'destroy'];

function Controller(opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.source) {
    throw new Error('No source specified.');
  }
  _.extend(this, opts);
}

Controller.prototype._requestHandler = require('./lib/request_handler');

METHODS.forEach(function (method) {
  Controller.prototype[method] = function (config) {
    var controller = configureController(method, this.source, config);
    var validationFailures = validateController(this.source, controller);
    if (validationFailures.length) {
      throw new Error(validationFailures.join('\n'));
    }
    return this._requestHandler(controller);
  };
}, this);

module.exports = Controller;
