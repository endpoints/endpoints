const config = require('../../knexfile');

const Knex = require('knex')(config);
const Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;
module.exports.Knex = Knex;
