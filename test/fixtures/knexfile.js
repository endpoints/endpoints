module.exports = {
  client: 'sqlite3',
  debug: false,
  connection: {
    filename: __dirname + '/db.sqlite3'
  },
  directory: __dirname + '/migrations',
};
