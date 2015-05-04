const thisFolderName = __dirname.split('/').pop();

const API = require('../../classes/api');
const model = require('./model');

module.exports = new API.Controller({
  model: model,
  basePath: thisFolderName,
  allowClientGeneratedIds: true,
  allowToManyFullReplacement: false
});
