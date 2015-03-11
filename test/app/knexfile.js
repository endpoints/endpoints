module.exports = {
  client: 'sqlite3',
  debug: false,
  connection: {
    filename: __dirname + '/test.db'
  },
  directory: __dirname + '/migrations'
};
