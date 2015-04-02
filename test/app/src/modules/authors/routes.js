const validateJsonSchema = require('../../../../../src/validate-json-schema');
const controller = require('./controller');
const schema = require('./schema');

module.exports = {
  post: {
    '/': controller.create({
      schema: schema,
      validators: validateJsonSchema
    }),
    '/:id/links/:relation': controller.update()
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:related': controller.read(),
    '/:id/links/:relation': controller.read()
  },
  patch: {
    '/:id': controller.update({
      schema: schema,
      validators: validateJsonSchema
    }),
    '/:id/links/:relation': controller.update()
  },
  delete: {
    '/:id': controller.destroy(),
    '/:id/links/:relation': controller.update()
  }
};
