# Step 2 - Hello, Bookshelf!

Bookshelf is a ORM for Javascript. We'll be using it for just that
purpose. 

[Here is a diff of the code we'll write in this section.](https://github.com/endpoints/tutorial/commit/548d33af1b876e771b1b9628ed6cb74ccb515f6c)

#### Bookshelf dependencies

`npm install bookshelf 0.7.9 --save`

#### Wiring up our Database, Knex, and Bookshelf

We need to connect Bookshelf and Knex 

Create a file `src/classes/database.js`:

    
    // src/classes/database.js
    const config = require('../../knexfile');

    const Knex = require('knex')(config);
    const Bookshelf = require('bookshelf')(Knex);

    module.exports = Bookshelf;


This file links up Bookshelf to our database via Knex and then
exports a Bookshelf Object that we'll extend when we write our 
models (via the base_model which we'll build next!). 

#### Base Model

All models in an Endpoints application extend a `base_model`.
You can use this to add common functionality to all the models
in your application.

Create a file `src/classes/base_model.js`:

    // src/classes/base_model.js
    const Bookshelf = require('./database');

    const instanceProps = {};
    const classProps = {};

    module.exports = Bookshelf.Model.extend(instanceProps, classProps);

Now that we have our Express Application, sqlite3 database, Knex, 
and Bookshelf set up, we are ready to write our model and start seeing
our data in the browser!

[Review the work we did in this section by review the diff.](https://github.com/endpoints/tutorial/commit/548d33af1b876e771b1b9628ed6cb74ccb515f6c)

[Next](/tutorial/step-3)
