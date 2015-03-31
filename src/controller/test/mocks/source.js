const bluebird = require('bluebird');

function Model () {}
Model.prototype.destroy = function () {};
Model.prototype.update = function () {};

Model.create = function () {};
Model.alternate = function() {};

module.exports = {
  typeName: function () { return 'mock'; },
  create: function() {},
  read: function () {},
  byId: function(id) {
    return new bluebird.Promise(function(resolve) {
      if (id === 'badId') {
        resolve(new Error());
      } else {
        resolve(new Model());
      }
    });
  },
  update: function () {},
  destroy: function () {},
  filters: function () {
    return ['id', 'title'];
  },
  relations: function () {
    return ['relation'];
  },
  model: Model
};
