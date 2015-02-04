const _ = require('lodash');
const database = require('fatansy-database');

const BaseModel = require('../classes/base_model');

module.exports = new BaseModel({
  database: database,
  typeName: 'store',
  relations: {
    books: {
      type: 'belongsToMany',
      lookup: function (store) {
        var books = _.chain(database.books_store).
          find({store_id:store.id}).
          pluck('book_id').
          value();
        return require('./books').filter({id:books});
      },
      target: function () {
        return require('./books');
      }
    }
  }
});
