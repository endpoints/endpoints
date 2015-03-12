const Bookshelf = require('./database');

const instanceProps = {};
const classProps = {};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
