function Model () {}
Model.prototype.destroy = function () {};
Model.prototype.update = function () {};

Model.create = function () {};
Model.alternate = function() {};

module.exports = {
  typeName: function () { return 'mock'; },
  create: function() {},
  read: function () {},
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
