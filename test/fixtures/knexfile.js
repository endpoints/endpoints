module.exports = {
  client: 'sqlite3',
  debug: false,
  connection: {
    filename: ':memory:'
  },
  directory: __dirname  + '/migrations',
};
