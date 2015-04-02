const path = require('path');

const express = require('express');
const routeBuilder = require('express-routebuilder');

const Endpoints = require('../../../../src');

module.exports = new Endpoints.Application({
  searchPaths: [path.join(__dirname, '..', 'modules')],
  routeBuilder: function (routes, prefix) {
    return routeBuilder(express.Router(), routes, prefix);
  },
  Controller: Endpoints.Controller.extend({
    adapter: Endpoints.BookshelfAdapter,
    validators: [Endpoints.ValidateJsonSchema]
  })
});
