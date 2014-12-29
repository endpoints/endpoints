const extend = require('extend');

const parseOptions = require('./lib/parse_options');
const find = require('./lib/find');

function Express(opts) {
  extend(this, parseOptions(opts));
}

Express.prototype.find = function () {
  return find(this.source, this.receiver);
};

module.exports = Express;
