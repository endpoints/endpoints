'use strict';

exports.__esModule = true;

/*
  Returns the model or collection of models related to a given model. This
  makes it possible to support requests like:
  GET /chapters/1/book.stores?filter[opened_after]=2015-01-01

  Currently, this is extremely inefficient. See _query_related.js for why

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


   @param {String} mode - the related mode (related or relation)
   @param {Bookshelf.Model} model - the model class
   @param {Integer|String} id - the id of the source model
   @param {String} relation - Dot notated relation of source to find
   @param {Object} query - the result of RequestHandler#query
   @param {Object} mode - the result of RequestHandler#query
   @returns {Promise(Bookshelf.Model)|Promise(Bookshelf.Collection)}
*/
exports['default'] = readForRelated;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kapow = require('kapow');

var _kapow2 = _interopRequireDefault(_kapow);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _by_id = require('./by_id');

var _by_id2 = _interopRequireDefault(_by_id);

var _related = require('./related');

var _related2 = _interopRequireDefault(_related);

var _is_many = require('./is_many');

var _is_many2 = _interopRequireDefault(_is_many);

var _read = require('./read');

var _read2 = _interopRequireDefault(_read);

function readForRelated(mode, sourceModel, id, relation, query) {
  return _by_id2['default'](sourceModel, id, relation).then(function (result) {
    if (!result) {
      throw _kapow2['default'](404);
    }
    var relatedData = _related2['default'](result, relation);
    var hasMany = _is_many2['default'](relatedData);

    var relatedModel = hasMany ? relatedData.model : relatedData.constructor;
    var relatedIds = hasMany ? relatedData.map(function (m) {
      return m.id;
    }) : relatedData.id;

    // @todo fix this
    // currently, the route param :id winds up represented
    // as filter.id. this can cause collisions when doing
    // requests like GET /book/1/stores?filter[id]=2
    // the intent is to limit the stores related to the book to those
    // with the id one, but the actual impact is that it looks up
    // book id #2. see RequestHandler#read
    query.filter.id = query.filter.id ? _lodash2['default'].intersection(relatedIds, query.filter.id) : relatedIds;

    query.singleResult = !hasMany;

    return _read2['default'](relatedModel, query, mode).then(function (relatedResult) {
      relatedResult.sourceModel = result;
      relatedResult.relationName = relation;
      return relatedResult;
    });
  });
}

module.exports = exports['default'];