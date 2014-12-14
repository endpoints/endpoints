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
      return query.whereIn('active', value);
    },
    first: function (query, value) {
      return query.whereIn('first', value);
    },
    last: function (query, value) {
      return query.whereIn('last', value);
    },
    email: function (query, value) {
      return query.whereIn('email', value);
    },
    id: function (query, value) {
      return query.whereIn('id', value);
    },
    website: function (query, value) {
      return query.whereIn('website', value);
    }
  }
};


module.exports = Bookshelf.Model.extend(instanceProps, classProps);
