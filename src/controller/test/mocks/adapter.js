const bluebird = require('bluebird');

function Adapter(opts) {
  this.model = opts.model;
}
Adapter.prototype.typeName = function () { return 'mock'; },
Adapter.prototype.create = function() {},
Adapter.prototype.read = function () {},
Adapter.prototype.byId = function(id) {
    return new bluebird.Promise(function(resolve) {
      if (id === 'badId') {
        resolve(new Error());
      } else {
        resolve(new this.model());
      }
    });
  },
Adapter.prototype.update = function () {};
Adapter.prototype.destroy = function () {};
Adapter.prototype.filters = function () {
  return ['id', 'title'];
};
Adapter.prototype.relations = function () {
  return ['relation'];
};

module.exports = Adapter;
