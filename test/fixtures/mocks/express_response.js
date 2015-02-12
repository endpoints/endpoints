const sinon = require('sinon');

module.exports = function () {
  return {
    set: sinon.stub().returnsThis(),
    status: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis()
  };
};
