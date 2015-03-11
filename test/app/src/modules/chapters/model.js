const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'chapters',
  book: function () {
    return this.belongsTo(require('../books/model'));
  }
};

const classProps = {
  typeName: 'chapters',
  fields: [
    'id',
    'book_id',
    'title',
    'ordering'
  ],
  filters: {
    book_id: function (qb, value) {
      return qb.whereIn('book_id', value);
    },
    title: function (qb, value) {
      return qb.whereIn('title', value);
    },
    ordering: function (qb, value) {
      return qb.whereIn('ordering', value);
    }
  },
  relations: [
    'book'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
