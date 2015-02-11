const sinon = require('sinon');

module.exports = function (body) {
  return {
    accepts: sinon.stub().returns(false),
    params: {
      id: 1
    },
    query: {
      title: 'foo-bar-baz',
      unSupportedKey: 'something',
      include: 'books'
    },
    body: {
      mock: {
        key: 'value'
      }
    }
  };
};
