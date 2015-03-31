const Endpoints = require('../../../../../modules');
const schema = require('./schema');

module.exports = new Endpoints.Controller({
  adapter: new Endpoints.BookshelfAdapter({
     model: require('./model'),
     validate: schema
   })
});
