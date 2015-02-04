const _ = require('lodash');
const arrayify = require('arrayify');

function Model (opts) {
  _.extend(this, opts);
}

Model.prototype.data = function () {
  return this.database[this.typeName];
};

Model.prototype.create = function (params, cb) {
  var data = this.data();
  params.id = _.chain(data).max('id').value().id+1;
  data.push(params);
  process.nextTick(function () {
    cb(null, params);
  });
};

Model.prototype.byId = function (id, cb) {
  var data = this.data();
  var result = _.find(data, {id:id});
  process.nextTick(function () {
    return cb(null, result);
  });
};

Model.prototype.filter = function (params) {
  var search = _.chain(this.data());
  var filters = this.filters;
  return Object.keys(params).reduce(function (search, key) {
    var filterMethod = filters[key];
    if (!filterMethod) {
      throw new Error('No filtering method "'+key+'" on underlying model.');
    }
    search = filterMethod.call(filters, search, arrayify(params[key]));
    return search;
  }, search);
};

module.exports = Model;
