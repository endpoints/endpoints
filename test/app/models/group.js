const Bookshelf = require('../classes/db');

const instanceProps = {
  tableName: 'group',
  accounts: function () {
    return this.belongsToMany(require('./account'));
  }
};

const classProps = {

};


module.exports = Bookshelf.Model.extend(instanceProps, classProps);
