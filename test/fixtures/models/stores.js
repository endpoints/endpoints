const BaseModel = require('../classes/database').Model;

const instanceProps = {
  tableName: 'stores',
  books: function () {
    return this.belongsToMany(require('./books'));
  }
};

const classProps = {
  typeName: 'stores',
  columns: [
    'id',
    'name'
  ],
  filters: {},
  relations: [
    'books',
    'books.author'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
