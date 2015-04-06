const controller = require('./controller');

module.exports = {
  post: {
    '/': controller.create(),
    '/:id/links/:relation': controller.update()
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:related': controller.read(),
    '/:id/links/:relation': controller.read()
  },
  patch: {
    '/:id': controller.update(),
    '/:id/links/:relation': controller.update()
  },
  delete: {
    '/:id': controller.destroy(),
    '/:id/links/:relation': controller.update()
  }
};
