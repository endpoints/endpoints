const validateJsonSchema = require('../../../../../src/validate-json-schema');
const controller = require('./controller');
const schema = require('./schema');

exports.map = {
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
    '/:id/:related': controller.readRelated(),
    '/:id/links/:relation': controller.readRelation()
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
