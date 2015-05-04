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
