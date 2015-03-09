const _ = require('lodash');

const configure = require('./lib/configure');
const validate = require('./lib/validate');
const process = require('./lib/process');

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
  return function (opts) {
    var source = this.source;
    var config = configure(method, opts);
    var validationFailures = validate(method, source, config);
    if (validationFailures.length) {
      throw new Error(validationFailures.join('\n'));
    }
    return process(config, source);
  };
};

Controller.prototype.create = Controller.method('create');
Controller.prototype.read = Controller.method('read');
Controller.prototype.update = Controller.method('update');
Controller.prototype.destroy = Controller.method('destroy');

module.exports = Controller;
