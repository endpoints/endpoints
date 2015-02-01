# endpoints-application
> The entry point for your Endpoints API.

## What is it?
This is where your Endpoints application begins. Your application contains resources you've registered, produces route handlers for those resources, and provides self-documentation tooling.

## API

### constructor(opts)

Create an instance to register resources with.

```js
const Endpoints = require('endpoints');
const express = require('express');
const routeBuilder = require('express-routebuilder');

const Application = new Endpoints.Application({
  routeBuilder: function (routes, prefix) {
    return routeBuilder(express.Router(), routes, prefix);
  }
});
```

`opts.routeBuilder` - a function that returns a route handler for a resource

### #register(input)
Register a resource with your Application.  

`input` - a fully resolved path to the module folder or a valid resource object.

If providing a path, this currently expects that the provided directory will contain a `routes.js` file that exports an object compatible with [`express-routebuilder`](https://github.com/tkellen/node-express-routebuilder).

### #resource(resourceName)
Returns an object that represents the requested resource.

`resourceName` - a string name of the resource to retrieve  

### #endpoint(resourceName, prefix)
Generate a router for a resource.

`resourceName` - a string name of the resource to generate a router for  
`prefix` - an optional prefix for the router

### #manifest
Generate a JSON object that documents all endpoints which have been mounted.
