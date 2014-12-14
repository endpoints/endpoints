module.exports = {
  development: {
    database: {
      client: 'sqlite3',
      debug: true,
      connection: {
        filename: ':memory:'
      }
    },
    directory: __dirname+'/migrations',
    tableName: 'knex_version'
  }
}
