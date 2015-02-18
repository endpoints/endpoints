const _ = require('lodash');

module.exports = function(opts, source) {

  var controllerMethod = opts.controllerMethod;
  var modelMethod = opts.modelMethod;

  // The method is on prototype for update/destroy and on the model for
  // create: ¯\_(ツ)_/¯
  var modelMethodFn = source.model.prototype[modelMethod] || source.model[modelMethod];

  if (typeof modelMethodFn !== 'function' && controllerMethod.indexOf('read') !== 0) {
    throw new Error(_.capitalize(controllerMethod) + ' method "' + modelMethod + '" is not present.');
  }
};
