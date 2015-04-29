'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _expect = require('chai');

var _splitStringProps = require('../../lib/split_string_props');

var _splitStringProps2 = _interopRequireDefault(_splitStringProps);

describe('splitStringProps', function () {
  it('should turn comma-separated object props into an array of strings', function () {
    var input = {
      id: '1,2',
      date_published: '2015-03-03',
      title: 'a,b'
    };
    var output = {
      id: ['1', '2'],
      date_published: '2015-03-03',
      title: ['a', 'b']
    };
    _expect.expect(_splitStringProps2['default'](input)).to.deep.equal(output);
  });
});