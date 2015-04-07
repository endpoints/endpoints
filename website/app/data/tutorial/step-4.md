# Hello, express-routebuilder!

#### An Authors Routes file

Create `src/modules/authors/routes.js`

    const controller = require('./controller');

    module.exports = {
      post: {
        '/': controller.create()
      },
      get: {
        '/': controller.read(),
        '/:id': controller.read()
      },
      patch: {
        '/:id': controller.update()
      },
      delete: {
        '/:id': controller.destroy()
      }
    };

### Dependencies

#### `express-routebuilder`

To build out our routes, we'll be utilizing a package named
[`express-routebuilder`](https://github.com/tkellen/js-express-routebuilder).
This package allows you module-based declarative route definiton.

`npm install express-routebuilder --save`

You don't *have to use it, but we think it's a nice idea.

#### `body-parser`

In the switch from major version 3 to 4, Express externalized the
ability to parse the body of an http request into a module called
`body-parser`. Since we intend to support POST and PATCH, we need
to also install `body-parser` as a dependency.

`npm install body-parser --save`

The opinions of the author regarding this externalization will
remain un-elaborated.

#### express-routebuilder

Let's require the dependencies that we just install at the
top of our Express application:


    // src/index.js
    // ...
    const bodyParser = require('body-parser');
    const routeBuilder = require('express-routebuilder');
    // ...

Once you've added this to your `src/index.js` head to your terminal
and run `npm install` to make sure all of your dependencies are working.

### Build out our routes

Now that we've set up our dependencies, let's get to utilizing them!
When we require `express-routebuilder` we expose a constructor, `()`
on the route-builder constant; this constructor takes 2 parameters:
an express app and a declarative routes object.

#### `routes.js`

The second paramter our route-builder constructor takes is a routes
object. For our `authors` object, assuming a RESTful interface, we'll
create a file `src/modules/authors/routes.js`:


    // src/modules/authors/routes.js
    const controller = require('./controller');

    module.exports = {
    post: {
      '/': controller.create()
    },
    get: {
      '/': controller.read(),
      '/:id': controller.read(),
    },
    patch: {
      '/:id': controller.update()
    },
    delete: {
      '/:id': controller.destroy()
    }
  };


#### Adding our Modules routes to our Express Application

Given our `routes.js` file for our authors module, let's add those
defined routes to our Express application in `src/index.js`.

First we'll require our authors' routes file:

    var authorRoutes = require('./modules/authors/routes');

Then we'll created an Express sub-application, `authorSubApp`, using
`express-routebuilder`'s exposed constructor, `routebuilder()`. This
constructor takes 3 parameters: `express.Router()`, a routes file, and
a string that contains the api prefix. For our application, this
expression ends up looking like this:

    var authorSubApp = routeBuilder(express.Router(), authorRoutes, 'api');

Now we need to tell our application to use this subapplication. To do
that, we use the Express application function [`app.use`](http://expressjs.com/api.html#app.use).
`app.use` takes 2 parameters: a path, and a function. In our case, the
path is `"/authors", and the function is the sub-application, `authorSubApp`,
giving us:

    app.use('/authors', authorSubApp);

This means that whenever a request URI has the prefix `/authors`, we'll
use the routes defined by the application we passed, i.e. `authorSubApp`.

-/-

In the end, our `src/index.js` looks like:


    // src/index.js
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');
    const routeBuilder = require('express-routebuilder');

    var Author = require('./modules/authors/controller');

    app.get('/', Author.read());

    var authorRoutes = require('./modules/authors/routes');
    var authorSubApp = routeBuilder(express.Router(), authorRoutes, 'api');

    app.use('/authors', authorSubApp);

    module.exports = app;
