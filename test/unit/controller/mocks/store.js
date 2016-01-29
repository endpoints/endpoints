function Store(opts) {
  this.model = opts.model;
}
Store.prototype.typeName = function () { return 'mock'; },
Store.prototype.create = function() {},
Store.prototype.read = function () {},
Store.prototype.byId = function(id) {
    return new Promise(function(resolve, reject) {
      if (id === 'badId') {
        reject(new Error());
      } else {
        resolve(new this.model());
      }
    });
  },
Store.prototype.update = function () {};
Store.prototype.destroy = function () {};
Store.prototype.filters = function () {
  return ['id', 'title'];
};
Store.prototype.allRelations = function () {
  return ['relation'];
};
Store.prototype.relations = function () {
  return ['relation'];
};

export default Store;
