"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Resource = function Resource(name, routes, controller) {
    _classCallCheck(this, Resource);

    this.name = name;
    this.routes = routes;
    this.controller = controller;
};

exports["default"] = Resource;
;
module.exports = exports["default"];