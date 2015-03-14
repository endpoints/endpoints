const RequestHandler = require('..');
const expect = require('chai').expect;
const sinon = require('sinon');

var req = {
  headers: {
    accept: 'application/vnd.api+json'
  },
  body: {}
};
var source = {
  typeName: function() {}
};

it('it should run user supplied validators', function() {
  var validator = sinon.spy();
  var config = {
    validators: [validator]
  };
  var request = new RequestHandler(config, source);

  expect(request.validate(req)).to.be.undefined;
  expect(validator.calledOnce).to.be.true;
});


it('it should return an error if the custom validator errors', function() {
  var config = {
    validators: [function() {
      return {
        message: 'I am an error'
      };
    }]
  };
  var request = new RequestHandler(config, source);

  var error = request.validate(req);
  expect(error).to.deep.equal({
    message: 'I am an error'
  });
});
