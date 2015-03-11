const controller = require('./controller');
const schema = require('./schema');

module.exports = {
  post: {
    '/': controller.create({
      method: 'createWithRandomBook',
      validate: schema
    })
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:relation': controller.read()
  },
  patch: {
    '/:id': controller.update({
      validate: schema
    })
  },
  delete: {
    '/:id': controller.destroy()
  }
};
