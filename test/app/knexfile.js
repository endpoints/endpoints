module.exports = {
  client: 'sqlite3',
  debug: false,
  connection: {
    filename: ':memory:'
  },
  directory: __dirname + '/migrations',
  pool: {
    afterCreate: function (conn, cb) {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  }
};
