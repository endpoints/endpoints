'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _creator = require('../../lib/create');

var _creator2 = _interopRequireWildcard(_creator);

var create = _creator2['default'].bind(null, function (data) {
  return data;
});

describe('create', function () {

  it('should return data and code 201', function () {
    var input = {
      id: '1',
      type: 'test'
    };
    var config = {
      typeName: 'thing'
    };
    var output = create(config, input);
    _expect.expect(output.code).to.equal('201');
    _expect.expect(output.data).to.deep.equal(input);
    _expect.expect(output.headers).to.deep.equal({
      location: '/' + config.typeName + '/' + input.id
    });
  });
});