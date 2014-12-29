const Bookshelf = require('../../classes/database');

const instanceProps = {
  tableName: 'books',
  author: function () {
    return this.belongsTo(require('../authors/model'));
  },
  series: function () {
    return this.belongsTo(require('../series/model'));
  },
  chapters: function () {
    return this.hasMany(require('../chapters/model'));
  },
  firstChapter: function () {
    return this.hasMany(require('../chapters/model')).query(function (qb) {
      qb.where('ordering', 1);
    });
  }
};

const classProps = {
  resourceName: 'books',
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
    published_before: function (qb, value) {
      return qb.where('date_published', '<', value);
    },
    published_after: function (qb, value) {
      return qb.where('date_published', '>', value);
    },
    title: function (qb, value) {
      return qb.whereIn('title', value);
    }
  },
  relations: {
    chapters: 'chapters',
    first_chapter: 'firstChapter',
    /* unsupported
    specificChapter: function (params) {
      return this.hasMany('../chapters/model').query(function (qb) {

      });
    }
    */
    series: 'series',
    author: 'author'
  }
};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
