const port = process.env.PORT || '8080';
const host = process.env.HOST || '0.0.0.0';
const express = require('express');
const app = express();

app.use(require('./app'));

app.listen(port, host);

console.log('Server running %s:%d...', host, port);

module.exports = app;
