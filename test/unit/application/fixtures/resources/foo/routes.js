export const basePath = 'foo';
export const map = {
  get: {
    '/': function (request, response) {
      response.send('test');
    }
  }
};
