const controller = require('./controller');
const schema = require('./schema');

const update = controller.update({
  validate: schema
});

module.exports = {
  post: {
    '/': controller.create({
      validate: schema
    })
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:relation': controller.read()
  },
  patch: {
    '/:id': update,
    '/:id/:relation': update,
  },
  delete: {
    '/:id': controller.destroy()
  }
};
