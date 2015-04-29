'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function Adapter(opts) {
  this.model = opts.model;
}
Adapter.prototype.typeName = function () {
  return 'mock';
}, Adapter.prototype.create = function () {}, Adapter.prototype.read = function () {}, Adapter.prototype.byId = function (id) {
  return new _bluebird2['default'].Promise(function (resolve) {
    if (id === 'badId') {
      resolve(new Error());
    } else {
      resolve(new this.model());
    }
  });
}, Adapter.prototype.update = function () {};
Adapter.prototype.destroy = function () {};
Adapter.prototype.filters = function () {
  return ['id', 'title'];
};
Adapter.prototype.relations = function () {
  return ['relation'];
};

exports['default'] = Adapter;
module.exports = exports['default'];