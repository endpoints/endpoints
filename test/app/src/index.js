require('babel/register');

const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const routeBuilder = require('express-routebuilder');

const modulePath = path.join(__dirname, 'modules');
const resources = fs.readdirSync(modulePath);

const Endpoints = require('../../../modules');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
  type: ['application/json', 'application/vnd.api+json']
}));

const Example = new Endpoints.Application({
  searchPaths: [modulePath],
  routeBuilder: function (routes, prefix) {
    return routeBuilder(express.Router(), routes, prefix);
  }
});

resources.forEach(function (resource) {
  Example.register(resource);
  app.use(Example.endpoint(resource, 'v1'));
});

app.get('/v1', function (request, response) {
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify(Example.index(), null, 2));
});

module.exports = app;
