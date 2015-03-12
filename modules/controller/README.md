# endpoints-controller
> CRUD methods for your API.

## What is it?
This library provides methods for generating request handling functions to connect HTTP requests to your data sources.


## API

### constructor(opts)

Create an instance to generate route handlers.

`opts.adapter` - an instance of `Endpoints.BookshelfAdapter`.

```js
const Endpoints = require('endpoints');
const model = require('path/to/bookshelf/model');

const Application = new Endpoints.Controller({
  adapter: new Endpoints.BookshelfAdapter({
    model: model
  });
});
```

*__Note:__ Bookshelf is currently the only ORM supported by Endpoints, but additional "source" adapters may be written in the future.*

### #create(opts)
Returns a json-api compliant, node-style request handling function for the underlying adapter.

`opts.method` - a string specifying an alternate static method (must be defined on underlying model) to call when handling requests.

### #read(opts)
Returns a json-api compliant, node-style request handling function for the underlying adapter.

`opts.include` - an array of relations to include by default  
`opts.filter` - an object whose key/value pairs are used to filter the request  
`opts.raw` - a boolean indicating the raw result from the underlying ORM should be sent as a response.  
`opts.pass` - a boolean indicating the contents of the response   should be set to `response.data` and `response.code` and the `next` method should be called, deferring output to the next item in a middleware stack. *__Note:__ this option will likely be replaced with a callback function.*

### #update(opts), #destroy(opts)
Returns a json-api compliant, node-style request handling function for the underlying adapter.

`opts.method` - specify an alternate prototype method (must be defined on underlying model) to call when handling requests.
