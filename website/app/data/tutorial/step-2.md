# Step 2 - Hello, Bookshelf!

Up until this point we have set up 2 Express applications, 
a sqlite3 database and Knex as a way to create tables and 
fill that database our mock fantasy book data.

Now we need a way to take that data from our database and use
it in our application. While one could write SQL from scratch,
generally speaking, one uses an ORM, or Object Relational 
Mapper, to use data from a SQL database in their application.

Bookshelf is a ORM for Javascript. We'll be using it for just that
purpose. In this step, we'll add Bookshelf to our application
and configure it to work with Knex and our Database. We'll also
prepare a Base Model class, which we will extend for every model
in our application.

[Here is a diff of the code we'll write in this section.](https://github.com/endpoints/tutorial/commit/548d33af1b876e771b1b9628ed6cb74ccb515f6c)

Endpoints is specifically configured to work with Bookshelf; so
you'll never have to worry about writing or changing anything. 
Check out the Endpoints.BookshelfAdapter API docs or guide
for more information about how that is implemented.

#### Bookshelf dependencies

In order to use Bookshelf, we need to add it as a dependency:

`npm install bookshelf 0.7.9 --save`

*NB: Bookshelf is not yet in a major version, and we anticipate
that it will change quite a bit in the upcoming months. Luckily,
Endpoints.Adapter, as mentioned above, manages that interface and
should mitigate endpoints API changes that would result from a
major verison release of Bookshelf.*

#### Wiring up our Database, Knex, and Bookshelf

In the last step we configured Knex to work with our database by
creating a `knexfile.js`. In order to use Bookshelf, we need to
pass it the specific Knex client that we are using, as per that
`knexfile.js`. 

To do that, we'll instantiate our Knex client by requiring the 
`knex` package and passing it our `knexfile`. Then, we'll 
instantiate Bookshelf, passing it our Knex client. 

Create a file `src/classes/database.js`:

    
    // src/classes/database.js
    const config = require('../../knexfile');

    const Knex = require('knex')(config);
    const Bookshelf = require('bookshelf')(Knex);

    module.exports = Bookshelf;


This file exports a Bookshelf Object that we'll extend when we
write our models (via the base_model which we'll build next!). 

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

[Review the work we did in this section by looking over the diff.](https://github.com/endpoints/tutorial/commit/548d33af1b876e771b1b9628ed6cb74ccb515f6c)
