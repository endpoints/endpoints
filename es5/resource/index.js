'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _libRequire_search = require('./lib/require_search');

var _libRequire_search2 = _interopRequireDefault(_libRequire_search);

var _libRequire_silent = require('./lib/require_silent');

var _libRequire_silent2 = _interopRequireDefault(_libRequire_silent);

var Resource = (function () {
    function Resource(name, routes, controller) {
        _classCallCheck(this, Resource);

        this.name = name;
        this.routes = routes;
        this.controller = controller;
    }

    Resource.createFromFS = function createFromFS(name, searchPaths) {
        var routeModulePath, moduleBasePath;
        if (typeof name === 'string') {
            routeModulePath = _libRequire_search2['default'](_path2['default'].join(name, 'routes'), searchPaths);
            moduleBasePath = _path2['default'].dirname(routeModulePath);
            return new this(name, require(routeModulePath), _libRequire_silent2['default'](_path2['default'].join(moduleBasePath, 'controller')));
        }
        if (!name) {
            name = {};
        }
        if (!name.name) {
            throw new Error('Unable to parse a module without a name.');
        }
        if (!name.routes) {
            throw new Error('Unable to parse a module without a routes object.');
        }
        return name;
    };

    return Resource;
})();

;

exports['default'] = Resource;
module.exports = exports['default'];