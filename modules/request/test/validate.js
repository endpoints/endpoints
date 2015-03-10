var Request = require('..');
const expect = require('chai').expect;
const sinon = require('sinon');

var req = {
  headers: {
    accept: 'application/vnd.api+json'
  }
};
var source = {
  typeName: function() {}
};

it('it should run user supplied validators', function() {
  var validator = sinon.spy();
  var config = {
    validators: [validator]
  };
  var request = new Request(req, config, source);


  expect(request.validate()).to.be.undefined;
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
  var request = new Request(req, config, source);


  var error = request.validate();
  expect(error).to.deep.equal({
    message: 'I am an error'
  });
});
