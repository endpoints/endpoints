# Application Structure

While not necessary by any means, there is a recommended
andpoints application structure:
    
    + application
      + src
        + classes
          - base_model.js
          - database.js
        + modules
          + authors
              - model.js
              - controller.js
              - routes.js
              - schema.js
          + books
              - model.js
              - controller.js
              - routes.js
              - schema.js
        - index.js
      - index.js
      - knexfile.js
      - package.json

### `/`: Application Root Directory

The root of our application directory contains the `package.json`
and database configuration. 

- `index.js` - An Express application that starts up a web server,
consumes the application within `src`

- `knexfile.js` - A configuration file that connects Knex to the
application's database setup. In order to use the command line tool,
this must be namespaced by environment (the default env is
`development`). For more information on Knex in an endpoints app, 
check out the [Hello Tutorial! Step 1 - Hello, Knex!](/tutorial/step-1).

- `package.json` - A configuration file containing meta-data about
the application and a list of it's dependencies to be installed via
`npm`.

### `src`: Application Source

- `index.js` - An Express application that serves an API. For more
information on Express in an endpoints app see the
[Hello Tutorial! Step 0 - Hello, Express!](/tutorialstep-0).

#### `src/classes`: Classes

- `base_model.js` - Extends Bookshelf.Model. All functionality that
should be shared across all of an application's models should be 
put here.

- `database.js` - Wires up Bookshelf and Knex. For more information
on the how Knex and Bookshelf work together in an endpoints app see
the [Hello Tutorial! Step 2 - Hello, Bookshelf!](/tutorial/step-2).

#### `src/modules`: Modules

- `model.js` - A Bookshelf.Model, extends BaseModel. Define instance
properties, class properties, and filters here.

- `controller.js` - Creates a new instance of Endpoints.Controller
by passing `model.js`, wrapped by Endpoints.BookshelfAdapter, as a
parameter.

- `routes.js` - Contains the routes.

- `schema.js` - Validation happens in the `routes.js`, this file is 
required under the `validate` key.
