module.exports = {
  get: {
    '/': function (request, response) {
      response.send('test');
    }
  }
};
