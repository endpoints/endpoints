'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _libCreate_from_fs = require('./lib/create_from_fs');

var _libCreate_from_fs2 = _interopRequireDefault(_libCreate_from_fs);

var Resource = function Resource() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var searchPaths = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  _classCallCheck(this, Resource);

  if (typeof opts === 'string' && Array.isArray(searchPaths)) {
    opts = _libCreate_from_fs2['default'](opts, searchPaths);
  }
  if (!opts.name) {
    throw new Error('Resource must have a name.');
  }
  if (!opts.routes) {
    throw new Error('Resource must have routes.');
  }
  this.name = opts.name;
  this.routes = opts.routes;
  this.controller = opts.controller;
};

exports['default'] = Resource;
module.exports = exports['default'];