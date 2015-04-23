import {expect} from 'chai';
import sinon from 'sinon';

import RequestHandler from '../';

var req = {
  headers: {
    accept: 'application/vnd.api+json'
  },
  body: {}
};
var source = {
  typeName: function() {}
};

it('it should run user supplied validators', () => {
  var validator = sinon.spy();
  var config = {
    validators: [validator]
  };
  var request = new RequestHandler(source, config);

  expect(request.validate(req)).to.be.undefined;
  expect(validator.calledOnce).to.be.true;
});


it('it should return an error if the custom validator errors', () => {
  var config = {
    validators: [function() {
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
