const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'series',
  books: function () {
    return this.hasMany(require('../books/model'));
  }
};

const classProps = {
  resourceName: 'series',
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

module.exports = BaseModel.extend(instanceProps, classProps);
