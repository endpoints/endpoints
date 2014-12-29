const Bookshelf = require('../../classes/database');

const instanceProps = {
  tableName: 'series',
  books: function () {
    return this.hasMany(require('../books/model'));
  }
};

const classProps = {
  columns: [
    'id',
    'title'
  ],
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value);
    },
    title: function (qb, value) {
      return qb.whereIn('title', value);
    }
  },
  relations: {
    books: 'books'
  }
};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
