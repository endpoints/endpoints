const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routeBuilder = require('express-routebuilder');
const modulesDir = path.join(__dirname, 'modules');
const modules = fs.readdirSync(modulesDir);
const versions = [1];
const isProductionHost = false;

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = {};
var currentVersion = versions.slice().pop();
modules.forEach(function (resource) {
  var namespace, filters, subapp;
  var resourceDir = path.join(modulesDir, resource);
  var routeFile = path.join(resourceDir, 'routes.js');
  var modelFile = path.join(resourceDir, 'model.js');
  if (fs.existsSync(routeFile)) {
    if (!isProductionHost) {
      console.log('Building '+resource+' routes...');
    }
    namespace = '/:version(v('+versions.join('|')+')?)?/'+resource;
    if (fs.existsSync(modelFile)) {
      filters = Object.keys(require(modelFile).filters).join(',');
    }
    subapp = routeBuilder(express, require(routeFile));
    app.use(namespace, subapp);
    routes[resource] = '/v'+currentVersion+'/'+resource;
    if (filters) {
      routes[resource] += '{?'+filters+'}';
    }
  }
  app.get('/', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(routes, null, 2));
  });
});

module.exports = app;
