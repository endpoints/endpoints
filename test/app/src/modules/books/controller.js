const API = require('../../classes/api');

module.exports = new API.Controller({
  model: require('./model')
});
