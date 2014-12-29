const controller = require('./controller');

module.exports = {
  get: {
    '/': controller.find(),
    '/:id': controller.find()
  }
};
