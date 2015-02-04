const BaseModel = require('../classes/database').Model;

const instanceProps = {
  tableName: 'stores',
  books: function () {
    return this.belongsToMany(require('../stores/model'));
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
    'books'
  ]
};

module.exports = BaseModel.extend(instanceProps, classProps);
