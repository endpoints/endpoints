'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

var fkeyCheck = /foreign key constraint/i;
var constraintCheck = /constraint/i;

exports['default'] = function (model, cb) {
  var transaction = model.transaction || model.constructor.transaction;
  if (!transaction) {
    throw new Error('Please assign Bookshelf.transaction.bind(Bookshelf) to the class\n       properties of your base model under the key "transaction".');
  }
  return transaction(cb)['catch'](function (e) {
    var err = e;
    // rethrow with 404 for fkey constraint failures
    if (fkeyCheck.exec(e.message)) {
      err = _kapow2['default'].wrap(e, 404);
    } else if (constraintCheck.exec(e.message)) {
      err = _kapow2['default'].wrap(e, 409);
    }
    throw err;
  });
};

module.exports = exports['default'];