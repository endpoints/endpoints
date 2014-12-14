module.exports = {
  development: {
    database: {
      client: 'sqlite3',
      debug: false,
      connection: {
        filename: ':memory:'
      }
    },
    directory: __dirname+'/migrations',
    tableName: 'knex_version'
  }
}
