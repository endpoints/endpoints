# endpoints-controller
> CRUD methods for your API.

## What is it?
This library provides powerful methods for generating request handling functions that make it very easy to connect HTTP requests to your data sources.

## API

### constructor(opts)

Create an instance to power your requests.

```js
const Endpoints = require('endpoints');
const Application = new Endpoints.Application();
```

### #register(input)
Register a resource with your Application.  

`input` - a fully resolved path to the module folder or a valid resource object.

If providing a path, this currently expects that the provided directory will contain a `routes.js` file that exports an object compatible with [`express-routebuilder`](https://github.com/tkellen/node-express-routebuilder).

### #resource(resourceName)
Returns an object that represents the requested resource.

`resourceName` - a string name of the resource to retrieve  

### #endpoint(resourceName, prefix)
Generate a router for provided resource.

`resourceName` - a string name of the resource to generate an endpoint for  
`prefix` - an optional string prefix for routes in the resource

### #manifest
Generate a JSON object that documents all endpoints which have been mounted.
