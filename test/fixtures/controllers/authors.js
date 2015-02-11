const Endpoints = require('../../../index');

module.exports = new Endpoints.Controller({
  source: new Endpoints.BookshelfSource({
    model: require('../models/authors')
  })
});
