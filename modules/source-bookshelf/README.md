# endpoints-source-bookshelf
> An Endpoints source adapter for Bookshelf models.

## What is it?
This module wraps Bookshelf so Endpoints can communicate with it. Any data source can be used with Endpoints if it is wrapped in a "source" API that matches the following.

Calling this API directly should be a rare, `endpoints-controller` will typically calls these methods for you when responding to HTTP requests.

### API

### constructor(opts)
```js
const BookshelfSource = require('endpoints').Source.Bookshelf;
const Source = new BookshelfSource({
  model: require('./path/to/bookshelf/model')
});
```

### #filters()
Returns the object on the underlying model where filtering methods are specified. The keys of this object represent valid query params for API requests made against this source.

### #relations()
Returns an array of valid relations for the underlying model. The elements of this array represent valid relations which can be included in API requests made against this source e.g. `/resource?include=relation1,relation2`.

### #filter(params)
Returns a query object, as filtered by the provided params. Keys in the params object map to filters, values on the params object are used to produce the filter.

### #typeName
Returns the type of data the underlying model represents. This controls the resource name used in responses (per the [json-api spec](http://jsonapi.org/format/#document-structure-resource-representations)).

### #read(opts, cb)
Read data from the underlying model.

* `opts.filters` an object that will be passed to `#filter` to produce the query.
* `opts.relations` an array of valid relations to include in the request
* `opts.one` a boolean field indicating that the primary resource being requested should be represnted as [individual resource](http://jsonapi.org/format/#document-structure-individual-resource-representations) rather than a collection.
* `opts.raw` an option to forgeo any post-processing of results from the query (the default behavior is to format the results in a json-api compliant format).
* `cb` a node-style callback which receives the result

### #create(method, params, cb)
Create new record using the underlying model.

* `method` the method name on the underlying model to call (defaults to `create`)
* `params` the params for creation
* `cb` a node-style callback which receives the created resource

### #update(model, params, cb)
Update supplied model using the provided params.

* `method` the method name on the underlying model to call (defaults to `create`)
* `params` the params for update
* `cb` a node-style callback which receives the updated resource

### #destroy(model, params, cb)
Delete supplied model.

* `method` the method name on the underlying model to call (defaults to `create`)
* `params` the params for creation
* `cb` a node-style callback which receives the updated resource
