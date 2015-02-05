# endpoints-application
> The entry point for your Endpoints API.

## What is it?
This is where your Endpoints application begins. Your application contains resources you've registered, produces route handlers for those resources, and provides self-documentation tooling.

## API

### constructor(opts)

Create an instance to register resources with, and to generate request handlers from.

```js
const Endpoints = require('endpoints');
const express = require('express');
const routeBuilder = require('express-routebuilder');

const Application = new Endpoints.Application({
  searchPaths: ['/abs/path/to/modules'],
  routeBuilder: function (routes, prefix) {
    return routeBuilder(express.Router(), routes, prefix);
  }
});
```

`opts.routeBuilder` - a function that returns a route handler for a resource

### #register(input)
Register a resource with your Application.  

`input` - the name of a module (aka, any folder in the searchPaths).

*__Note:__ Will look for `routes.js` in the located module directory.*

### #resource(resourceName)
Returns an object that represents the requested resource.

`resourceName` - string name of a registered resource

### #endpoint(resourceName, prefix)
Generate a router for a resource.

`resourceName` - string name of a registered resource
`prefix` - an optional prefix for the router

*__Note:__ This will require the `routes.js` file for the module and pass it into `#routeBuilder`, returning a request handler.*

### #manifest
Generate a JSON object that describes all mounted resources.

### #index
Generate a JSON object that describes all mounted resources for self-documentation display.
