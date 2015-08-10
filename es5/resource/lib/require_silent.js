"use strict";

exports.__esModule = true;

exports["default"] = function (file) {
  try {
    return require(file);
  } catch (e) {
    return e;
  }
};

module.exports = exports["default"];