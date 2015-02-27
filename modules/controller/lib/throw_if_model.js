const Kapow = require('kapow');

module.exports = function(model) {
  if (model) {
    throw Kapow(409, 'Model with this ID already exists');
  }
  return model;
};
