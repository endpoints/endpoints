export default {
  get: {
    '/': function (request, response) {
      response.send('test');
    }
  }
};
