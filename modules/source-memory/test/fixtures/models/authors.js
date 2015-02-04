const _ = require('lodash');
const database = require('fantasy-database');

const BaseModel = require('../classes/base_model');

module.exports = new BaseModel({
  database: database,
  typeName: 'authors',
  relations: {
    books: {
      type: 'hasMany',
      lookup: function (authors) {
        return _.chain(database.books).filter(function (book) {
          return _.contains(authors.pluck('id'), book.author_id);
        });
      },
      target: function () {
        return require('./books');
      }
    }
  },
  filters: {
    id: function (data, value) {
      return data.filter(function (author) {
        return _.contains(value, author.id);
      });
    },
    name: function (data, value) {
      return data.filter(function (author) {
        return _.contains(value, author.name);
      });
    },
    alive: function (data, isTrue) {
      if (isTrue) {
        return data.filter(function (author) {
          return !author.date_of_death;
        });
      } else {
        return data.filter(function (author) {
          return author.date_of_death;
        });
      }
    },
    dead: function (data, isTrue) {
      return this.alive(data, !isTrue);
    }
  }
});
