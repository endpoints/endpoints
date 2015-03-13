const validateJsonSchema = require('../../../../../modules/validate-json-schema');
const controller = require('./controller');
const schema = require('./schema');

module.exports = {
  post: {
    '/': controller.create({
      schema: schema,
      validators: validateJsonSchema
    })
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:relation': controller.read()
  },
  patch: {
    '/:id': controller.update({
      schema: schema,
      validators: validateJsonSchema
    }),
    '/:id/:relation': controller.update()
  },
  delete: {
    '/:id': controller.destroy()
  }
};
