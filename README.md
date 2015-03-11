# endpoints [![Build Status](https://secure.travis-ci.org/endpoints/endpoints.png)](http://travis-ci.org/endpoints/endpoints)

[![NPM](https://nodei.co/npm/endpoints.png)](https://nodei.co/npm/endpoints/)

Endpoints is a hypermedia API framework compliant with the [json api](http://jsonapi.org) specification, compatible with any http server that supports express or hapi style request handlers.

## What is it?

Endpoints gives you a powerful set of tools for defining and structuring an API. Endpoints conforms to the JSON API standard, a set of conventions for writing JSON-based APIs, so that your data can be transferred as efficiently as possible. Endpoints lets you define your API's routes and data model in a way that integrates with your existing web framework (*e.g.* [express](http://expressjs.com/) or [hapi](http://hapijs.com/)) and ORM (*e.g.* [Bookshelf](http://bookshelfjs.org/)).

*Check out the [example implementation](https://github.com/endpoints/example).*

## Endpoints Modules

These are the tools Endpoints provides for structuring your API.

### Endpoints.Application
A container for your API. All resources are registered with it, and all route handlers for your API should be created using it. This is mainly for making it possible to generate self-documentation. *Something* in the Endpoints stack needs to be aware of every resource/route created in the API. Further down the road, this could be used to do all sorts of magical convention-based stuff like creating admin interfaces, interactive API documentation, etc.

For a more comprehensive explanation, [see the `Endpoints.Application` README](https://github.com/endpoints/endpoints/blob/master/modules/application/README.md).

### Endpoints.Source
This is a thin wrapper for any ORM. Typically you will never interact with a Source directly. It presents a standardized, callback-based API that can communicate with `Endpoints.Controller`. There is currently only one implementation: `Endpoints.BookshelfSource`.

For a more comprehensive explanation, [see the `Endpoints.Source` README](https://github.com/endpoints/endpoints/blob/master/modules/source-bookshelf/README.md).

### Endpoints.Controller
This provides methods for generating CRUD request handling functions. Each controller is associated with a single `Source` instance. The API is very simple, providing `create`, `read`, `update`, & `destroy` methods, each of which can be configured with an options object.

For a more comprehensive explanation, [see the `Endpoints.Controller` README](https://github.com/endpoints/endpoints/blob/master/modules/controller/README.md).
