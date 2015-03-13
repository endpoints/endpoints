const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'stores',
  books: function () {
    return this.belongsToMany(require('../books/model'));
  }
};

const classProps = {
  typeName: 'stores',
  filters: {},
  relations: [
    'books',
    'books.author'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
