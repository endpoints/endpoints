const Bookshelf = require('../../classes/database');

const instanceProps = {
  tableName: 'books',
  author: function () {
    return this.belongsTo(require('../authors/model'));
  },
  series: function () {
    return this.belongsTo(require('../series/model'));
  }
};

const classProps = {
  columns: [
    'id',
    'author_id',
    'series_id',
    'date_published',
    'title'
  ],
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value);
    },
    author_id: function (qb, value) {
      return qb.whereIn('author_id', value);
    },
    series_id: function (qb, value) {
      return qb.whereIn('series_id', value);
    },
    date_published: function (qb, value) {
      return qb.whereIn('date_published', value);
    },
    title: function (qb, value) {
      return qb.whereIn('title', value);
    }
  },
  relations: {
    author: 'author',
    series: 'series'
  }
};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
