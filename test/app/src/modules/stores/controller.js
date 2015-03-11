const Endpoints = require('../../../../..');

module.exports = new Endpoints.Controller({
  source: new Endpoints.BookshelfSource({
    model: require('./model')
  })
});
