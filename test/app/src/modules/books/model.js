const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'books',
  hasTimestamps: true,
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
  },
  stores: function () {
    return this.belongsToMany(require('../stores/model'));
  }
};

const classProps = {
  typeName: 'books',
  filters: {
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
  relations: [
    'chapters',
    'firstChapter',
    'series',
    'author',
    'author.books',
    'stores',
    'stores.books'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
