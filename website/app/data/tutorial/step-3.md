# Step 3: Hello, Endpoints!

So far we have set up 2 Express applications, configured a
sqlite3 database and Knex, written and run migrations, written
and run seeds, added Bookshelf and wired it up to Knex and our
database.

In this step, we'll write a Bookshelf model for our authors
table. Then we'll use Endpoints.Controller to attach CRUD http
methods to our model, and use that to write an endpoint to
serve json-api compliant author data on our root route in our 
application.

[Check out the diff to see what we'll write.](https://github.com/endpoints/tutorial/commit/c7cf197f9c1988b4a4c6f82ee77750119b15ed74)

### Creating the first Model: Authors

Create a file `/modules/authors/model.js`:

  
    // modules/authors/model.js
    const BaseModel = require('../../classes/base_model');

    const instanceProps = {
      tableName: 'authors'
    };

    const classProps = {
      typeName: 'authors',
      filters: {
        id: function (qb, value) {
          return qb.whereIn('id', value);
        },
        name: function (qb, value) {
          return qb.whereIn('name', value)
        },
        alive: function (qb, value) {
          if (value) {
            return qb.whereNull('date_of_death');
          } else {
            return qb.whereNotNull('date_of_death');
          }
        },
        dead: function (qb, value) {
          return this.alive(qb, !value);
        }
      }
    };
  
    module.exports = BaseModel.extend(instanceProps, classProps);


### Endpoints dependency

In order to use endpoints, we need to include it as a dependency.
Type:

`npm install endpoints --save`

This tutorial uses features of endpoints that are newer than the
most recent release, so we'll need to go into our `package.json`
and edit the endpoints entry to point at the github repository:


    // package.json
    // ...
    "dependencies": {
      "endpoints": "git://github.com/endpoints/endpoints.git"
      //...
    }


### Endpoints Controller

In our author module directory, create a file called
`controller.js`:


    // src/modules/authors/controller.js
    const Endpoints = require('endpoints');

    module.exports = new Endpoints.Controller({
      adapter: new Endpoints.BookshelfAdapter({
        model: require('./model')
      })
    });


We can now require this file in our Express application, allowing us
access to the data from our database using CRUD convenience methods
as afforded to us by Endpoints.


### Wiring up our Model and Application Route

Let's change our root route in our `src/index.js` 
Express application to show the authors we have seeded into our 
database. To do this, we must:

- Require `modules/authors/controller`
- Replace the request handling callback with a Endpoints.Controller CRUD function
    
Your `src/index.js` should end up looking like this:
    
    
    // src/index.js
    const express = require('express');
    const app = express();

    var Author = require('./modules/authors/controller');

    app.get('/', Author.read());

    module.exports = app; 


We should now be able to start our application and see the author 
data in the browser. Try it out by typing `npm start`. You should see:


    {
      data: [
        {
          id: "1",
          name: "J. R. R. Tolkien",
          date_of_birth: "1892-01-03",
          date_of_death: "1973-09-02",
          type: "authors",
          links: {
            self: "/authors/1"
          }
        },
        {
          id: "2",
          name: "J. K. Rowling",
          date_of_birth: "1965-07-31",
          date_of_death: null,
          type: "authors",
          links: {
            self: "/authors/2"
          }
        }
      ]
    }


[Check out the diff to review what we covered in this section.](https://github.com/endpoints/tutorial/commit/c7cf197f9c1988b4a4c6f82ee77750119b15ed74)

[Next](/tutorial/step-4)
