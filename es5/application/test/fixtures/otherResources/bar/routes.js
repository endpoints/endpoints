'use strict';

module.exports = {
  get: {
    '/': function _(request, response) {
      response.send('test');
    }
  }
};