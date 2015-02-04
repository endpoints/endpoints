const BaseModel = require('../classes/database').Model;

const instanceProps = {
  tableName: 'series',
  books: function () {
    return this.hasMany(require('../books/model'));
  }
};

const classProps = {
  typeName: 'series',
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
  relations: [
    'books'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
