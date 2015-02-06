# endpoints-application
> The entry point for your Endpoints API.

## What is it?
This is where your Endpoints application begins. An application contains resources you've registered, generates request handlers for those resources, and provides self-documentation tooling.

## API

### constructor(opts)

Create an instance to register resources with, and to generate request handlers from.

`opts.searchPaths` - an array of paths to search when registering resources.
`opts.routeBuilder` - a function that returns a route handler for a resource.

Express Example:
```js
const Endpoints = require('endpoints');
const express = require('express');
const routeBuilder = require('express-routebuilder');
const app = express();

const Application = new Endpoints.Application({
  searchPaths: ['/abs/path/to/modules'],
  routeBuilder: function (routes, prefix) {
    return routeBuilder(express.Router(), routes, prefix);
  }
});

Application.register('resource');

app.use(Application.endpoint('resource'));

app.get('/', function (request, response) {
  response.set('Content-Type', 'application/json');
  response.send(JSON.stringify(Application.index(), null, 2));
});
```

Hapi Example:
```js
const hapi = require('hapi');
const routeBuilder = require('hapi-routebuilder');

const server = new hapi.Server();
server.connection({ port: 3000 });

const Application = new Endpoints.Application({
  searchPaths: ['/abs/path/to/modules'],
  routeBuilder: function (routes, prefix) {
    return routeBuilder(server, routes, prefix);
  }
});

Application.register('resource').endpoint('resource');
```

### #register(input)
Register a resource with your Application.  By default, this will look for a matching folder name in any of your application's searchPaths. Once found, it will look for a `routes.js` file in that folder. The object this file exports will be used when calling `#endpoint` to create a request handler.

`input` - the name of a module, or an object describing the resource:

`input.name` - the name of the resource  
`input.routes` - a route object to be passed to your application's routeBuilder
`input.controller` - an instance of `Endpoints.Controller` (used to introspect the resource for generating documentation).


### #resource(resourceName)
Returns an object that represents the requested resource.

`resourceName` - string name of a registered resource

### #endpoint(resourceName, prefix)
Create request handlers for a resource.

`resourceName` - string name of a registered resource  
`prefix` - an optional prefix for the router

*__Note:__ This will pass the `routes` property of the resource into `#routeBuilder`, along with the prefix.*

### #manifest
Generate a JSON object that describes all mounted resources.

### #index
Generate a JSON object that describes all mounted resources for self-documentation display.
