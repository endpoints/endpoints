'use strict';

exports.__esModule = true;
exports['default'] = {
  get: {
    '/': function _(request, response) {
      response.send('test');
    }
  }
};
module.exports = exports['default'];