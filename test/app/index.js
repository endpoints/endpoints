const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const BaseController = require('../../controller');
const BookshelfSource = require('../../source').Bookshelf;

const AccountController = new BaseController({
  source: new BookshelfSource(require('./models/account')),
  params: ['id', 'first', 'last', 'active', 'email', 'website']
});

const GroupController = new BaseController({
  source: new BookshelfSource(require('./models/account'))
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/accounts', [
  AccountController.find(),
  AccountController.fetch(),
  AccountController.serialize()
]);

app.get('/accounts/:id', [
  AccountController.find(),
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
