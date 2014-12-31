const controller = require('./controller');

module.exports = {
  post: {
    '/': controller.create()
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read({one: true})
  },
  put: {
    '/:id': controller.update()
  },
  delete: {
    '/:id': controller.destroy()
  }
};
