const _ = require('lodash');

const configureController = require('./lib/configure_controller');
const validateController = require('./lib/validate_controller');
const requestHandler = require('./lib/request_handler');

function Controller(opts) {
  if (!opts) {
    opts = {};
  }
  if (!opts.source) {
    throw new Error('No source specified.');
  }
  _.extend(this, opts);
}

Controller.method = function (method) {
  return function (config) {
    var source = this.source;
    var controller = configureController(method, source, config);
    var validationFailures = validateController(method, source, controller);
    if (validationFailures.length) {
      throw new Error(validationFailures.join('\n'));
    }
    return requestHandler(controller);
  };
};

Controller.prototype.create = Controller.method('create');
Controller.prototype.read = Controller.method('read');
Controller.prototype.update = Controller.method('update');
Controller.prototype.destroy = Controller.method('destroy');

module.exports = Controller;
