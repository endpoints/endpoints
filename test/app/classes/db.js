const config = require('../knexfile').development;
const Knex = require('knex')(config.database);
const Bookshelf = require('bookshelf')(Knex);

Knex.migrate.latest(config).then(function () {
  return Knex('account').insert([
    {
      id: 1,
      name: 'tyler',
      email: 'tyler@sleekcode.net',
      active: true
    },
    {
      id: 2,
      name: 'tara',
      email: 'taraalan@gmail.com',
      active: false
    }
  ]).then(function () {
    return Knex('group').insert([
      { id: 1, name: 'user' },
      { id: 2, name: 'admin' }
    ]);
  }).then(function () {
    return Knex('account_group').insert([
      { account_id: 1, group_id: 1 },
      { account_id: 1, group_id: 2 },
      { account_id: 2, group_id: 1 }
    ]);
  });
});

module.exports = Bookshelf;
