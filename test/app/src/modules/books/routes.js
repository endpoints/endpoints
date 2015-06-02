const validateJsonSchema = require('../../../../../src/validate-json-schema');
const controller = require('./controller');
const schema = require('./schema');

exports.map = {
  post: {
    '/': controller.create({
      schema: schema,
      validators: validateJsonSchema
    }),
    '/:id/relationships/:relation': controller.createRelation()
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read(),
    '/:id/:related': controller.readRelated(),
    '/:id/relationships/:relation': controller.readRelation()
  },
  patch: {
    '/:id': controller.update({
      schema: schema,
      validators: validateJsonSchema
    }),
    '/:id/relationships/:relation': controller.updateRelation()
  },
  delete: {
    '/:id': controller.destroy(),
    '/:id/relationships/:relation': controller.destroyRelation()
  }
};
