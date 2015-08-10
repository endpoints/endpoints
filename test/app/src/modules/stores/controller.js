const API = require('../../classes/api');
const model = require('./model');

module.exports = new API.Controller({
  model: model,
  allowClientGeneratedIds: true,
  allowToManyFullReplacement: false
});
