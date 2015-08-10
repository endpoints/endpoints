# v0.9.0 -> v0.10.0
Controllers must now specify a responder.

Express, Hapi and Koa are supported out of the box.

**v0.9.0 (old)**
```js
const API = new Endpoints.Application({
  Controller: Endpoints.Controller.extend({
    baseUrl: '/v1',
    format: Endpoints.Format.jsonapi,
    store: Endpoints.Store.bookshelf,
    validators: [Endpoints.ValidateJsonSchema]
  })
});
```

**v0.10.0 (new)**
```js
const API = new Endpoints.Application({
  Controller: Endpoints.Controller.extend({
    baseUrl: '/v1',
    responder: Endpoints.Responder.express // or .hapi or .koa
    format: Endpoints.Format.jsonapi,
    store: Endpoints.Store.bookshelf,
    validators: [Endpoints.ValidateJsonSchema]
  })
});
```

Controllers can now infer their basePath by convention, reading their model's
type using the store adapter.

**v0.9.0 (old)**
```js
module.exports = new API.Controller({
  model: model,
  basePath: 'manually-specified-value'
});
```

**v0.10.0 (new)**
```js
module.exports = new API.Controller({
  model: model
  // no basePath needed if it matches the model's type
});
```

# v0.8.0 -> v0.9.0
Per JSON-API 1.0, the recommended relationship url has changed from `/:id/links/:relation` to `/:id/relationships/:relation`.

# v0.7.0 -> v0.8.0
Controllers now have public APIs specifically for handling relations:
* `Controller#createRelation`
* `Controller#updateRelation`
* `Controller#destroyRelation`

Each of these was previously handled by `Controller#update`. A sample router file from the example application with both the old and new APIs can be found below.

**v0.7.0 (old)**
```js
const controller = require('./controller');

exports.map = {
  post: {
    '/': controller.create(),
    '/:id/links/:relation': controller.update()
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:related': controller.readRelated(),
    '/:id/links/:relation': controller.readRelation()
  },
  patch: {
    '/:id': controller.update(),
    '/:id/links/:relation': controller.update()
  },
  delete: {
    '/:id': controller.destroy(),
    '/:id/links/:relation': controller.update()
  }
};
```

**v0.8.0 (new)**
```js
const controller = require('./controller');

exports.map = {
  post: {
    '/': controller.create(),
    '/:id/links/:relation': controller.createRelation()
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:related': controller.readRelated(),
    '/:id/links/:relation': controller.readRelation()
  },
  patch: {
    '/:id': controller.update(),
    '/:id/links/:relation': controller.updateRelation()
  },
  delete: {
    '/:id': controller.destroy(),
    '/:id/links/:relation': controller.destroyRelation()
  }
};
```


# v0.6.0 -> v0.7.0

In order to support generating correct links in API responses, controllers must now include a `basePath` and `baseUrl`.

**v0.6.0 (old)**
```js
const API = new Endpoints.Application({
  Controller: Endpoints.Controller.extend({
    format: Endpoints.Format.jsonapi,
    store: Endpoints.Store.bookshelf,
    validators: [Endpoints.ValidateJsonSchema]
  })
});

const BooksController = new API.Controller({
  model: require('./model')
});
```
**v0.7.0 (new)**
```js
const API = new Endpoints.Application({
  Controller: Endpoints.Controller.extend({
    baseUrl: '/v1',
    format: Endpoints.Format.jsonapi,
    store: Endpoints.Store.bookshelf,
    validators: [Endpoints.ValidateJsonSchema]
  })
});

const BooksController = new API.Controller({
  basePath: 'books', // could also use folder name, or
                     // model typeName, or anything else.
  model: require('./model'),
});
```

---

For ease of future extension, route files should export a `map` property rather than the routes object directly:

**v0.6.0 (old)**

```js
const controller = require('./controller');

module.exports = {
  get: {
    '/': controller.read()
  }
  // ...
}
```

**v0.7.0 (new)**

```js
const controller = require('./controller');

exports.map = {
  get: {
    '/': controller.read()
  }
  // ...
}
```

---

`Application#endpoint` no longer supports arbitrary prefixes.

**v0.6.0 (old)**
```js
const express = require('express');
const API = require('./classes/api');
const app = express();
app.use(API.endpoint('books', '/v1')); // v1 not known by controller
```

**v0.7.0 (new)**
```js
const express = require('express');
const API = require('./classes/api');
const app = express();
// v1 string is defined in controller as baseUrl
app.use(API.endpoint('books'));
```
