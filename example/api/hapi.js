const fs = require('fs');
const path = require('path');
const Hapi = require('hapi');

const modulesDir = path.join(__dirname, 'modules');
const modules = fs.readdirSync(modulesDir);

const app = new Hapi.Server();
app.connection({ port: 8080 });

var routeHelp = {};
modules.forEach(function (resource) {
  var namespace, routes;
  var resourceDir = path.join(modulesDir, resource);
  var routeFile = path.join(resourceDir, 'routes.js');
  var modelFile = path.join(resourceDir, 'model.js');
  if (fs.existsSync(routeFile)) {
    routes = require(routeFile);
    console.log('Building '+resource+' routes...');
    namespace = '/'+resource;
    if (fs.existsSync(modelFile)) {
      filters = Object.keys(require(modelFile).filters).join(',');
    }
    routeHelp[resource] = namespace;
    if (filters) {
      routeHelp[resource] += '{?'+filters+'}';
    }
    Object.keys(routes).forEach(function (verb) {
      var endpoints = routes[verb];
      Object.keys(endpoints).forEach(function (endpoint) {
        // format express routes as hapi route
        var route = endpoint.slice();
        if (route === '/')  {
          route = route.slice(1);
        }
        route = namespace+(route.replace(':id','{id}')),
        app.route({
          method: verb,
          path: route,
          handler: endpoints[endpoint]
        });
      });
    });
  }
});

app.route({
  method: 'get',
  path: '/',
  handler: function (request, reply) {
    reply(JSON.stringify(routeHelp, null, 2)).type('application/json');
  }
});

module.exports = app;
