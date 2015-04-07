'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var RequestHandler = require('..');

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
  var validator = sinon.spy();
  var config = {
    validators: [validator]
  };
  var request = new RequestHandler(source, config);

  expect(request.validate(req)).to.be.undefined;
  expect(validator.calledOnce).to.be['true'];
});

it('it should return an error if the custom validator errors', function () {
  var config = {
    validators: [function () {
      return {
        message: 'I am an error'
      };
    }]
  };
  var request = new RequestHandler(source, config);

  var error = request.validate(req);
  expect(error).to.deep.equal({
    message: 'I am an error'
  });
});