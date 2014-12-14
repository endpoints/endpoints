const config = require('../knexfile').development;
const Knex = require('knex')(config.database);
const Bookshelf = require('bookshelf')(Knex);

Knex.migrate.latest(config).then(function () {
  return Knex('account').insert([
    {
      id: 1,
      first: 'tyler',
      last: 'kellen',
      email: 'tyler@sleekcode.net',
      website: 'goingslowly.com',
      active: true
    },
    {
      id: 2,
      first: 'tara',
      last: 'alan',
      email: 'taraalan@gmail.com',
      website: 'goingslowly.com',
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
