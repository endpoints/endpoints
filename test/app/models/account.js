const Bookshelf = require('../classes/db');

const instanceProps = {
  tableName: 'account',
  groups: function () {
    return this.belongsToMany(require('./group'));
  }
};

const classProps = {
  finders: {
    active: function (query, value) {
      return query.where({active:value});
    },
    email: function (query, value) {
      return query.where({email:value});
    },
    id: function (query, value) {
      return query.where({id:value});
    }
  }
};


module.exports = Bookshelf.Model.extend(instanceProps, classProps);
