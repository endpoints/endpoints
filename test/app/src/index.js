require('babel/register');

const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const modulePath = path.join(__dirname, 'modules');
const resources = fs.readdirSync(modulePath);

const API = require('./classes/api');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
  type: ['application/json', 'application/vnd.api+json']
}));

resources.forEach(function (resource) {
  API.register(resource);
  app.use(API.endpoint(resource, 'v1'));
});

app.get('/v1', function (request, response) {
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify(API.index(), null, 2));
});

module.exports = app;
