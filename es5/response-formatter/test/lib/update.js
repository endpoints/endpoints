'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _updater = require('../../lib/update');

var _updater2 = _interopRequireDefault(_updater);

var update = _updater2['default'].bind(null, function (data) {
  return data;
});

describe('#update', function () {

  it('should return data and code 200', function () {
    var input = {
      data: {
        id: '1',
        type: 'test'
      }
    };
    var opts = {
      typeName: 'thing'
    };
    var output = update(input, opts);
    _expect.expect(output.code).to.equal('200');
    _expect.expect(output.data).to.deep.equal(input);
  });
});