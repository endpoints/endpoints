const Endpoints = require('../../../../..');

module.exports = new Endpoints.Controller({
  adapter: new Endpoints.BookshelfAdapter({
    model: require('./model')
  })
});
