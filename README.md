# endpoints [![Build Status](https://secure.travis-ci.org/endpoints/endpoints.png)](http://travis-ci.org/endpoints/endpoints)
> yet another rest api framework

[![NPM](https://nodei.co/npm/endpoints.png)](https://nodei.co/npm/endpoints/)

# What is it?
This repository is a work in progress. The example folder contains the current structure for what will eventually become a convention-over-configuration based approach to developing [json-api](http://jsonapi.org) compliant apis in javascript.

Endpoints currently uses a Knex/Bookshelf/Express stack, but it is built with modularity in mind. Subbing in another data layer, or http server should be trivial.

## Setup Instructions

1. Clone repo
2. `npm install`
3. `npm start`
4. Open browser to (for example):
  - [http://localhost:8080](http://localhost:8080)
  - [http://localhost:8080/v1/authors](http://localhost:8080/v1/authors)
  - [http://localhost:8080/v1/authors/1](http://localhost:8080/v1/authors/1)
  - [http://localhost:8080/v1/authors/1,2](http://localhost:8080/v1/authors/1,2)
  - [http://localhost:8080/v1/authors?with_related=books](http://localhost:8080/v1/authors?with_related=books)
  - [http://localhost:8080/v1/authors?alive=true](http://localhost:8080/v1/authors?alive=true)
  - [http://localhost:8080/v1/authors?dead=true](http://localhost:8080/v1/authors?dead=true)
  - [http://localhost:8080/v1/books?with_related=chapters,author](http://localhost:8080/v1/books?with_related=chapters,author)
  - [http://localhost:8080/v1/books?with_related=first_chapter](http://localhost:8080/v1/books?with_related=first_chapter)
  - [http://localhost:8080/v1/books?published_before=1990-01-01](http://localhost:8080/v1/books?published_before=1990-01-01)
  - [http://localhost:8080/v1/books?published_after=1990-01-01](http://localhost:8080/v1/books?published_after=1990-01-01)
  - [http://localhost:8080/v1/chapters?book_id=1](http://localhost:8080/v1/chapters?book_id=1)
  - [http://localhost:8080/v1/chapters/1](http://localhost:8080/v1/chapters/1)

## Module Overviews
Below, some high level explanations of the current module-set that comprises the next version of endpoints.


## endpoints-receiver
You specify which params and relations the user is allowed to request, this library extracts them from the request, normalizing values when possible (string 'true' becomes boolean true, string 'false', boolean false, comma delimited query params become arrays, etc). If a query param is provided which is not in the whitelist, it is ignored.  The data from this library is fed into the "source" (see next).

[see example here](https://github.com/endpoints/endpoints/blob/master/example/api/modules/books/controller.js#L9-L12)

---

## endpoints-source
A thin abstraction over any type of data store. Provides the following methods:

#### filters()
returns an object on the underlying model where the filtering methods are specified ([see example](https://github.com/endpoints/endpoints/blob/master/example/api/modules/books/model.js#L30-L46)).

#### relations
returns an object on the underlying model where the relations are specified ([see example](https://github.com/endpoints/endpoints/blob/master/example/api/modules/books/model.js#L47-L59))

#### filter(params)
returns a "query", as filtered by the provided params object.  keys in the params map to filters on the underlying model. the query is built incrementally, passing the value of each provided param into the filtering method under its key. if there is no filtering method for a provided key, it is ignored.

#### fetch(query, settings, cb)
takes a query produced by `filter`, along with a settings object to configure how it is fetched (in the current case, the only option is which relations to include) and calls back with the resulting data.

---

## endpoints-request-express
A thin abstraction over the receiver and the source, this creates an express middleware that determines which params are valid using the receiver. the params are passed to the source to create a query for the resource, and the data the source produces is serialized to the consumer.
