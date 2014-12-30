const BaseModel = require('../../classes/base_model');

const instanceProps = {
  tableName: 'authors',
  books: function () {
    return this.hasMany(require('../books/model'));
  }
};

const classProps = {
  resourceName: 'authors',
  columns: [
    'id',
    'name',
    'date_of_birth',
    'date_of_death'
  ],
  filters: {
    id: function (qb, value) {
      return qb.whereIn('id', value);
    },
    name: function (qb, value) {
      return qb.whereIn('name', value)
    },
    alive: function (qb, value) {
      if (value) {
        return qb.whereNull('date_of_death');
      } else {
        return qb.whereNotNull('date_of_death');
      }
    },
    dead: function (qb, value) {
      return this.alive(qb, !value);
    },
    date_of_birth: function (qb, value) {
      return qb.whereIn('date_of_birth', value);
    },
    date_of_death: function (qb, value) {
      return qb.whereIn('date_of_death', value);
    },
    born_before: function (qb, value) {
      return qb.where('date_of_birth', '<', value);
    },
    born_after: function (qb, value) {
      return qb.where('date_of_birth', '>', value);
    }
  },
  relations: {
    books: 'books'
  }
};

module.exports = BaseModel.extend(instanceProps, classProps);
