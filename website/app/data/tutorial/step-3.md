# Step 3: Our First Model and the  Endpoints Controller

### Creating the first Model: Authors

Create a file `/modules/authors/model.js`:

    const BaseModel = require('../../classes/base_model');

    const instanceProps = {
      tableName: 'authors',
      books: function () {
        return this.hasMany(require('../books/model'));
      }
    };

    const classProps = {
      typeName: 'authors',
      createWithRandomBook: function (params) {
        return this.create(params).then(function (model) {
          return require('../books/model').create({
            title: Math.random().toString(36).slice(-8),
            date_published: new Date().toISOString().slice(0,10),
            author_id: model.get('id')
          }).return(model);
        });
      },
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
        },
        date_of_birth: function (qb, value) {
          return qb.whereIn('date_of_birth', value);
        },
        date_of_death: function (qb, value) {
          return qb.whereIn('date_of_death', value);
        },
        born_before: function (qb, value) {
          return qb.where('date_of_birth', '<', value);
        },
        born_after: function (qb, value) {
          return qb.where('date_of_birth', '>', value);
        }
      },
      relations: [
        'books',
        'books.chapters'
      ]
    };

    module.exports = BaseModel.extend(instanceProps, classProps);

#### The Endpoints Controller

`npm install endpoints 0.5.6 --save`

In our author module directory, create a file called
`controller.js`:

    const Endpoints = require('endpoints');

    module.exports = new Endpoints.Controller({
      adapter: new Endpoints.BookshelfAdapter({
        model: require('./model')
      })
    });

We can now require this file in our Express application, allowing us
access to the data from our database using CRUD convenience methods
as afforded to us by Endpoints.

Let's change our root route in our `src/index.js` 
Express application to show the authors we have seeded into our 
database. To do this, we must:

1. Require `modules/authors/controller`
2. Call `.read()` on our model inside our route definition


    // src/index.js
    const express = require('express');
    const app = express();

    // Author is an Endpoints Controller object
    var Author = require('./modules/authors/controller');

    app.get('/', function(req,res){
      var data = Author.read(); // read is a method from Endpoints
      res.send(JSON.stringify(data));
    });

    module.exports = app; 

We should now be able to start our application and see the author 
data in the browser. Try it out by typing `npm start`.
