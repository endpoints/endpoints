"use strict";

exports.__esModule = true;

exports["default"] = function (data) {
  delete data.type;
  delete data.links;
  return data;
};

module.exports = exports["default"];