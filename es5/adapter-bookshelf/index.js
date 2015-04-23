'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _bPromise = require('bluebird');

var _bPromise2 = _interopRequireWildcard(_bPromise);

var _create$update = require('./lib/base_methods');

var _processFilter = require('./lib/process_filter');

var _processFilter2 = _interopRequireWildcard(_processFilter);

var _processSort = require('./lib/process_sort');

var _processSort2 = _interopRequireWildcard(_processSort);

var _destructureRequest = require('./lib/destructure_request_data');

var _destructureRequest2 = _interopRequireWildcard(_destructureRequest);

var _Kapow = require('kapow');

var _Kapow2 = _interopRequireWildcard(_Kapow);

// FIXME: decide if this responsibility lives in the adapter or
// in the formatter. i think adapter? this would mean a wholesale
// refactoring of the jsonapi formatter to work with adapters
// rather than bookshelf models. that might make a lot of sense.

var _relate = require('../formatter-jsonapi/lib/relate');

var _relate2 = _interopRequireWildcard(_relate);

/**
  An adapter that allows endpoints to interact with a Bookshelf model.
*/

var BookshelfAdapter = (function () {

  /**
    The constructor.
    @constructs BookshelfAdapter
    @param {Object} opts - opts.model: a bookshelf model.
  */

  function BookshelfAdapter() {
    var opts = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BookshelfAdapter);

    var model = opts.model;
    if (!model) {
      throw new Error('No bookshelf model specified.');
    }
    this.model = model;

    // add missing methods on the model if needed. eventually something
    // like this should exist in bookshelf or another higher order library
    // natively.
    if (!model.create) {
      model.create = _create$update.create;
    }
    if (!model.prototype.update) {
      model.prototype.update = _create$update.update;
    }
  }

  /**
    An array of filters available on the underlying model. This controls
    which filters will be recognized by a request.
     For example, `GET /authors?filter[name]=John` would only filter by name
    if 'name' was included in the array returned by this function.
     @returns {Array} An array of object ids.
  */

  BookshelfAdapter.prototype.filters = (function (_filters) {
    function filters() {
      return _filters.apply(this, arguments);
    }

    filters.toString = function () {
      return _filters.toString();
    };

    return filters;
  })(function () {
    var filters = Object.keys(this.model.filters || {});
    // TODO: remove this and have the id filter be present by
    // default on all bookshelf models. the alternative to this
    // is putting the id filter in every model as boilerplate
    // or waiting until the next version of bookshelf, where
    // something like this can be added by default.
    if (filters.indexOf('id') === -1) {
      filters.push('id');
    }
    return filters;
  });

  /**
    Provides an array of valid relations on the underlying model. This controls
    which relations can be included in a request.
     For example, `GET /authors/1?include=books` would only include related
    books if `books` was included in the array returned by this function.
     @returns {Array} An array containing relations on the model.
   */

  BookshelfAdapter.prototype.relations = function relations() {
    return this.model.relations || [];
  };

  /**
    Provides the type name of the underlying model. This controls the
    value of the `type` property in responses.
     @returns {String}
  */

  BookshelfAdapter.prototype.typeName = function typeName() {
    return this.model.typeName;
  };

  /**
    Returns the model or collection of models related to a given model. This
    makes it possible to support requests like:
    GET /chapters/1/book.stores?filter[opened_after]=2015-01-01
     Currently, this is extremely inefficient. Here's why:
     Bookshelf cannot compose a query like this
    ```sql
    SELECT stores.*
    FROM stores
    INNER JOIN books_stores ON (books_stores.store_id = stores.id)
    WHERE books_stores.book_id = (SELECT book_id FROM chapters WHERE id=1);
    AND stores.opening_date > '2015-01-01'
    ```
     In order to make this work (for now), the approach is to fetch all of
    the intermediate tables directly, ultimately winding up with a list of
    ids which are valid for the final node in the relation string. Then,
    using this list of IDs, we can further filter the request.
     ```sql
    SELECT book_id FROM chapter WHERE id = 1;
    SELECT store_id FROM books_stores WHERE book_id = <book_id>
    SELECT * FROM stores WHERE id = <store_id> AND opening_date > '2015-01-01'
    ```
     Note that even if Bookshelf could do the above, it would still have to
    query for intermediate tables when polymorphic relations were involved.
    One more reason not to use polymorphic relations.
     @todo investigate this form to see if we can clean up some:
    ```js
    this.model.collection().fetch({
      withRelated: [
        {
          'nested.relation': function (qb) {
            // perform read filtering here
          }
        }
      ]
    })
    ```
     This will be resolved in a future version of Bookshelf.
     @param {Object}
      opts - the result of running RequestHandler#query for the request.
    @param {String}
      relation - A dot notated relation to find relative to the provided model.
    @param {Bookshelf.Model} model
     @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)} related models.
  */

  BookshelfAdapter.prototype.related = (function (_related) {
    function related(_x, _x2, _x3, _x4) {
      return _related.apply(this, arguments);
    }

    related.toString = function () {
      return _related.toString();
    };

    return related;
  })(function (opts, relation, mode, model) {
    var related = _relate2['default'](model, relation);
    var relatedModel, relatedIds;
    if (related.models) {
      relatedModel = related.model;
      relatedIds = related.map(function (m) {
        return m.id;
      });
    } else {
      relatedModel = related.constructor;
      relatedIds = related.id;
    }

    if (mode === 'relation') {
      opts.baseType = this.typeName();
      opts.baseId = model.id;
      opts.baseRelation = relation;
      opts.fields = {};
      opts.fields[relatedModel.typeName] = ['id', 'type'];
    }

    // @todo fix this
    // currently, the route param :id winds up represented
    // as filter.id. this can cause collisions when doing
    // requests like GET /book/1/stores?filter[id]=2
    // the intent is to limit the stores related to the book to those
    // with the id one, but the actual impact is that it looks up
    // book id #2. see RequestHandler#read
    opts.filter.id = opts.filter.id ? _import2['default'].intersection(relatedIds, opts.filter.id) : relatedIds;

    return new this.constructor({
      model: relatedModel
    }).read(opts, mode);
  });

  /**
    A convenience method to find a single model by id.
     @param {int} id - the id of the model
    @param {Array} relations - the relations to fetch with the model
     @returns {Promise(Bookshelf.Model)} A model and its related models.
  */

  BookshelfAdapter.prototype.byId = function byId(id) {
    var relations = arguments[1] === undefined ? [] : arguments[1];

    return this.model.collection().query(function (qb) {
      return qb.where({ id: id });
    }).fetchOne({
      withRelated: relations
    })['catch'](TypeError, function (e) {
      // A TypeError here most likely signifies bad relations passed into withRelated
      throw _Kapow2['default'](404, 'Unable to find relations');
    });
  };

  /**
    Creates an object in the database. Returns an instance of the new object.
     @param {String} method - The name of the method on the model constructor to use for creation.
    @param {Object} params - The attributes to use for the new model.
     @returns {Promise(Bookshelf.Model)} A new model.
  */

  BookshelfAdapter.prototype.create = function create(method, params) {
    if (!method) {
      throw new Error('No method provided to create with.');
    }
    if (!params) {
      params = {};
    }
    var self = this;
    return _destructureRequest2['default'](this.model.forge(), params).then(function (destructured) {
      return self.model[method](destructured.data, destructured.toManyRels);
    });
  };

  /**
    Retrieves a collection of models from the database.
     @param {Object} opts - the output of Request#query
     @returns {Promise(Bookshelf.Collection)} Models that match the provided opts.
  */

  BookshelfAdapter.prototype.read = function read(opts, mode) {
    if (!opts) {
      opts = {};
    }
    var self = this;
    var model = this.model;
    var ready = _bPromise2['default'].resolve();
    var singleResult = mode === 'single' || (mode === 'related' || mode === 'relation') && !Array.isArray(opts.filter.id);

    // populate the field listing for a table so we know which columns
    // we can use for sparse fieldsets.
    if (!this.columns) {
      ready = model.query().columnInfo().then(function (info) {
        self.columns = Object.keys(info);
      });
    }

    return ready.then(function () {
      var fields = opts.fields && opts.fields[self.typeName()];
      // this has to be done here because we can't statically analyze
      // the columns on a table yet.
      if (fields) {
        fields = _import2['default'].intersection(self.columns, fields);
        // ensure we always select id as the spec requires this to be present
        if (!_import2['default'].contains(fields, 'id')) {
          fields.push('id');
        }
      }

      return model.collection().query(function (qb) {
        qb = _processFilter2['default'](model, qb, opts.filter);
        qb = _processSort2['default'](self.columns, qb, opts.sort);
      }).fetch({
        // adding this in the queryBuilder changes the qb, but fetch still
        // returns all columns
        columns: fields,
        withRelated: _import2['default'].intersection(self.relations(), opts.include || [])
      }).then(function (result) {
        // This is a lot of gross in order to pass this data into the
        // formatter later. Need to formalize this in some other way.
        result.mode = mode;
        result.relations = opts.include;
        result.singleResult = singleResult;
        result.baseType = opts.baseType;
        result.baseId = opts.baseId;
        result.baseRelation = opts.baseRelation;
        return result;
      });
    });
  };

  /**
    Updates a provided model using the provided method.
     @param {Bookshelf.Model} model
    @param {String} method - The method on the model instance to use when updating.
    @param {Object} params - An object containing the params from the request.
     @returns {Promise(Bookshelf.Model)} The updated model.
  */

  BookshelfAdapter.prototype.update = function update(model, method, params) {
    if (!method) {
      throw new Error('No method provided to update or delete with.');
    }
    return _destructureRequest2['default'](model, params).then(function (destructured) {
      return model[method](destructured.data, destructured.toManyRels, model.toJSON({ shallow: true }));
    });
  };

  /**
    Deletes a model. Same implementation as update.
     @param {Bookshelf.Model} model
    @param {String} method - The method on the model instance to use when updating.
    @param {Object} params - An object containing the params from the request.
     @returns {Promise.Bookshelf.Model} The deleted model.
  */

  BookshelfAdapter.prototype.destroy = function destroy(model, method, params) {
    if (!method) {
      throw new Error('No method provided to update or delete with.');
    }
    return _destructureRequest2['default'](model, params).then(function (destructured) {
      return model[method](destructured.data, destructured.toManyRels, model.toJSON({ shallow: true }));
    });
  };

  return BookshelfAdapter;
})();

exports['default'] = BookshelfAdapter;
module.exports = exports['default'];