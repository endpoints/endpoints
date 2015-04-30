'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

var _RequestHandler = require('../');

var _RequestHandler2 = _interopRequireWildcard(_RequestHandler);

var req = {
  headers: {
    accept: 'application/vnd.api+json'
  },
  body: {}
};
var source = {
  typeName: function typeName() {}
};

it('it should run user supplied validators', function () {
  var validator = _sinon2['default'].spy();
  var config = {
    validators: [validator]
  };
  var request = new _RequestHandler2['default'](source, config);

  _expect.expect(request.validate(req)).to.be.undefined;
  _expect.expect(validator.calledOnce).to.be['true'];
});

it('it should return an error if the custom validator errors', function () {
  var config = {
    validators: [function () {
      return {
        message: 'I am an error'
      };
    }]
  };
  var request = new _RequestHandler2['default'](source, config);

  var error = request.validate(req);
  _expect.expect(error).to.deep.equal({
    message: 'I am an error'
  });
});