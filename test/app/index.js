const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const BaseController = require('../../controller');
const BaseModel = require('../../model');

const AccountController = new BaseController({
  model: new BaseModel(require('./models/account'))
});

const GroupController = new BaseController({
  model: new BaseModel(require('./models/account'))
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/accounts', [
  AccountController.find({
    params: ['id', 'active', 'email']
  }),
  AccountController.fetch(),
  AccountController.serialize()
]);

app.get('/accounts/:id', [
  AccountController.find({
    params: ['id', 'active']
  }),
  AccountController.fetchOne({
    withRelated: ['groups']
  }),
  AccountController.serialize()
]);

app.listen(8080);

/*
app.get('/groups', [
  GroupController.findMany,
  GroupController.serialize
]);
*/
