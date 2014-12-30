const controller = require('./controller');

module.exports = {
  post: {
    '/': controller.create()
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read()
  }
};
