# endpoints
## yet another rest api framework

[![Build Status](https://secure.travis-ci.org/endpoints/endpoints.png)](http://travis-ci.org/endpoints/endpoints)

[![NPM](https://nodei.co/npm/endpoints.png)](https://nodei.co/npm/endpoints/)

## Introduction
Endpoints is a framework for building ReSTful JSON APIs with [express](http://expressjs.com/), [bookshelf](http://bookshelfjs.org/) and [knex](http://knexjs.org/). Endpoints provides an expressive API with powerful defaults for taking data out of a relational database, and returning it as JSON to a client. Out of the box, just declaring a set of endpoint names

``` javascript
var express = require('express');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3'
  }
});

knex.migrate({
  up: function (knex) {  
    knex.schema.createTable('author', function (table) {
      table.increments('id');
      table.text('full_name').notNullable();
    })
    .createTable('comment', function (table) {
      table.increments('id');
      table.text('text').notNullable().defaultTo('');
    })
    .createTable('post', function (table) {
      table.increments('id');
      table.integer('author').references('id').inTable('author').notNullable();
      table.text(post_title').notNullable().defaultTo('');
      table.text('publish_date').notNullable().defaultTo('');
      table.text('post_content').notNullable().defaultTo('');
    })
    .createTable('post_comment', function (t) {
      t.increments('id');
      t.integer('post_id').references('id').inTable('post').notNullable().unique();
      t.integer('author_id').references('id').inTable('author').notNullable().unique();
    })
  },
  down: function (knex) {
    knex.schema.dropTableIfExists('author'),
    knex.schema.dropTableIfExists('comment'),
    knex.schema.dropTableIfExists('post'),
    knex.schema.dropTableIfExists('post_comment'),
  }
});

var API = new Endpoints({
  bookshelf: require('bookshelf')(knex),
  exoress: express,
  models: require('endpoints-model'),
  routers: require('endpoints-router'),
  controllers:require('endpoints-controller')
});


express.use(API.createEndpoints(['author', 'posts', 'comments']));

express.listen('0.0.0.0', 8000);
```


## Flow 
router -> model -> controller

When you instantiate an `API` and `createEndpoints` on it, default routers, models and controllers are initialized for each endpoint you specify. The default behavior enables you to `GET`, 'POST', 'PUT', and 'DELETE' to '/endpoint_name' and '/endpoint_name/:id'. To modify this behavior, you can extend the baseRouter, baseModel and/or baseController, and add your own functionality. Some example reasons to override might be to a) check if a user is logged in, or b) work with relationships like `/endpoint_name/:id/other_endpoint`.

If you go with the defaults provided, endpoints will use the [BaseController](), [BaseRouter]() and [BaseModel](), which are documented in their respective repos. The fields for the default model is inferred from the database you are connected to. In the above example, we have created created the fields that the model will use in the above example using knex migrations.

### Router
The router is responsible assigning a `model` to the request and running a series of controller middlewares. You can override the router and provide your own controller middlewares at your own routes:

``` javascript
var controller = require('endpoints-controller');
var BaseRouter = require('endpoints-router');

var postRouter = BaseRouter.extend({
  model: require('endpoints-model'),
  controller: controller,
  routes: {
    all: {
      '*': [
        // Make sure a user is logged in before fulfilling a req
        BaseRouter.isAuthenticated
      ]
    },
    get: {
      // Return all the comments for a given post at `/post/:id/comments`
      '/:id/comments': [
        controller.findMany,
        controller.serialize
      ]
    },
    post: {
      '*': [
        // Ensure that a user is an admin before you let them POST data
        // to this resource
        contorller.isAdmin
      ],
      '/:id/comment': [
        controller.findById,
        // createComment would be a custom controller that you would write
        controller.createComment, 
        controller.serialize
      ]
    },
    put: {
      '*': [
        // Ensure that a user is an admin before you let them PUT data
        // to this resource
        contorller.isAdmin
      ]
    },
    delete: {
      '/:id/comment/:id': [array of controllers]
    }
  }
});

export myRouter;

```
By default, the following controller middlewares are run for `GET`, 'POST', 'PUT', and 'DELETE':

#### all methods and routes
isAuthenticated,
assignModel(model)

#### GET `endpoint_name/`
* findMany
* serialize

#### GET `endpoint_name/:id/`
* findById
* serialize

#### POST `endpoint_name/`
* createdBy
* create,
* serialize

#### PUT `endpoint_name/:id`
* findById
* update
* serialize

#### DELETE `endpoint_name/:id`
* isAuthenticated
* findById
* destroyCascade
* serialize


### Controller
The controller is responsible for providing custom middlewares for the router to use. These middlewares that call methods from the model passed to it on the `req` object by the router, reason about what to do the the `res` object, and pass on execution to the next middleware with `next()`. You can override the controller for a given endpoint resource and create your own new middlewares:

``` javascript
const BaseController = require('endpoints-controller');

var PostController = BaseController.extend({
  create: BaseController.create('createWithToken'),
  findPostComments: BaseController.findRelated('PostComments'),
  destory: BaseController.destroy,
  updateWithRelationships: function (req, res, next) {
    var params = req.body;
    var postComments = params.postComments;
    req.model.save(req.body, {patch:true}).then(function (postModel) {
      postComments.map(function (post_id) {
        return postModel.addComment(comment_id);
      })
      .then(function () {
        res.data = postModel;
        next();
      });
    }).catch(function (e) {
      res.code = 422;
      res.data = { errors: e };
      next();
    });
  }
});

export PostController;
```

#### all default controllers available to you
The controller middlewares are responsible for calling methods on the models and updating the response to the client with the result.

##### create( methodname )
The create controller middleware is used to instantiate new `Model`s into `model`s and save them to the database. By default, `create()` calls the `create` method of the of the baseModel's class props, which forges a new record into the database. You can pass a different method name into `create`, and provide that method on the `Model` class props if you want to do some special creation behavior.

##### destroy
The `destroy` controller middleware is not invokable. It's calls the built in bookshelf destroy, updates the response according to the outcome and ticks `next()`.

##### destroyCascade 
The `destroyCascade` controller middleware is also not invokable, however it calls an endpoints method off of the baseModel instance props. This destroys the current model and all of it's dependant entities.

##### findById( options )
The `findById` controller middleware instantiates a `Model` into a `model` using a record from the database based with the id requested by the client (`req.params.id`). You can pass in an options object to get sub relations.

##### findMany( options )
The `findMany` controller middleware returns a bookshelf collection of models that the current user is allowed to see. You can pass in an options object to get sub relations.

##### findRelated( relation, subRelations )
The `findRelated` controller middleware returns a bookshelf collection of models that are related to the current `req.model`. Eg: find all comments for a given post with `findRelated('post')`. Passing an optional array of string subRelations (`['author', 'comments']`) will return related records as well.

##### serialize( method )
The `serialize` controller middleware turns the bookshelf models and bookshelf collections into JSON that we can send back to the user.

##### update( method )
The `update` controller middleware saves the current `req.model` with new params passed in.

### Model
The model is responsible for specifying the shape of the data. The Base Model that endpoints provides sets up some commonly used methods for interacting with models and groups of models. You can override the model for a given endpoint resource and add your own methods for interacting with the data base and presenting information to controllers:


``` javascript
var BaseModel = require('endpoints-model');
var PostModel = BaseModel.extend(
// Instance properties
{
  tableName: 'post',
  author: function () {
    return this.belongsTo(require('./author'));
  },
  post_comments: function () {
    return this.hasMany(require('./post_comment'), 'post_id');
  },
  addComment: function (account_id) {
    return require('./post_comments').findOrCreate({
      post_id: this.get('id'),
      comment_id: comment_id
    }).then(function () {
      return this;
    }.bind(this));
  }
},
// Class properties
{
  fields: [
    'id', 'post_title', 'publish_date', 'post_content'
  ],
  dependents: ['event_accounts'],
  links: ['comments']
});

module.exports = PostModel;
```

#### Model Hooks
Endpoints model allows you to define the following methods on your models:

##### `classProps.allowedFor = function( 'account', 'id' ) {}`

`allowedFor` automatically gets called by the endpoints controller for findById and findByMany if. `allowedFor` is a method of the class props. The first argument is an instance of the `account` model for the account making the current request. The second argument is the `id` of the record that the `account` is requesting. `id` only gets passed in to `allowedFor` during a `findById` lookup.

In `allowedFor`, you take the `account` and return a promise that resolves to an array of IDs that the `account` is allowed to look at.


##### `instanceProps.validate( params ) {}`

The instance `validate` method is run on every `model.save()`. It receives as it's single argument, a params object consisting of properties that the request would like to update of forge a model with.

Endpoints expects you to return a promise that resolves if the operation is valid, and rejects if it is not.

We use [checkit](https://github.com/tgriesser/checkit) by convention to run our validations, but you can use what ever you'd like.