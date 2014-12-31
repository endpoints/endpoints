const port = process.env.PORT || '8080';
const host = process.env.HOST || '0.0.0.0';

const inquirer = require('inquirer');
const express = require('express');

inquirer.prompt([
{
  name: 'server',
  type: 'list',
  message: 'Choose your server please.',
  choices: ['express', 'hapi']
}
], function (answers) {
  var server;
  process.env.serverType = answers.server;
  if (answers.server === 'express') {
    server = require('./api/express');
    server.listen(port, host);
    console.log('Server running on %s:%d', host, port);
  } else {
    server = require('./api/hapi');
    server.start(function () {
      console.log('Server running on %s:%d', host, port);
    });
  }

});
