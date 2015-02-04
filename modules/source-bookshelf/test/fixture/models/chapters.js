const BaseModel = require('../classes/database').Model;

const instanceProps = {
  tableName: 'chapters',
  book: function () {
    return this.belongsTo(require('./books'));
  }
};

const classProps = {
  typeName: 'chapters',
  columns: [
    'id',
    'book_id',
    'title',
    'ordering'
  ],
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value);
    },
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
