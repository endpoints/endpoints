const Bookshelf = require('./database');

const instanceProps = {};

const classProps = {
  create: function (params) {
    return this.forge(params).save().then(function (model) {
      return this.forge({id:model.id}).fetch();
    }.bind(this));
  }
};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
