const _ = require('lodash');
const database = require('fantasy-database');

const BaseModel = require('../classes/base_model');

module.exports = new BaseModel({
  database: database,
  typeName: 'books',
  relations: {
    author: {
      type: 'belongsTo',
      lookup: function (book) {
        return require('./authors').filter({id:book.author_id});
      },
      target: function () {
        return require('./authors');
      }
    },
    stores: {
      type: 'belongsToMany',
      lookup: function (book) {
        var stores = _.chain(database.books_store).
          find({book_id:book.id}).
          pluck('store_id').
          value();
        return require('./stores').filter({id:stores});
      },
      target: function () {
        return require('./stores');
      }
    }
  },
  filters: {
    id: function (data, value) {
      return data.filter(function (book) {
        return _.contains(value, book.id);
      });
    },
    title: function (data, value) {
      return data.filter(function (book) {
        return _.contains(value, book.title);
      });
    },
    author_id: function (data, value) {
      return data.filter(function (book) {
        return _.contains(value, book.author_id);
      });
    }
  }
});
