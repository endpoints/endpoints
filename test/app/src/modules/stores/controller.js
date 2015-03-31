const Endpoints = require('../../../../../modules');

module.exports = new Endpoints.Controller({
  adapter: new Endpoints.BookshelfAdapter({
    model: require('./model')
  })
});
