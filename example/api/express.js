const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routeBuilder = require('express-routebuilder');
const modulesDir = path.join(__dirname, 'modules');
const modules = fs.readdirSync(modulesDir);

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routeHelp = {};
modules.forEach(function (resource) {
  var namespace;
  var resourceDir = path.join(modulesDir, resource);
  var routeFile = path.join(resourceDir, 'routes.js');
  var modelFile = path.join(resourceDir, 'model.js');
  if (fs.existsSync(routeFile)) {
    console.log('Building '+resource+' routes...');
    namespace = '/'+resource;
    if (fs.existsSync(modelFile)) {
      filters = Object.keys(require(modelFile).filters).join(',');
    }
    app.use(namespace, routeBuilder(express.Router(), require(routeFile)));
    routeHelp[resource] = namespace;
    if (filters) {
      routeHelp[resource] += '{?'+filters+'}';
    }
  }
});
app.get('/', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(routeHelp, null, 2));
});

module.exports = app;
