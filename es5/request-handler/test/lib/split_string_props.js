'use strict';

var expect = require('chai').expect;

var splitStringProps = require('../../lib/split_string_props');

describe('splitStringProps', function () {
  it('should turn comma-separated object props into an array of strings', function () {
    var input = {
      id: '1,2',
      date_published: '2015-03-03',
      title: 'a,b'
    };
    var output = {
      id: ['1', '2'],
      date_published: ['2015-03-03'],
      title: ['a', 'b']
    };
    expect(splitStringProps(input)).to.deep.equal(output);
  });
});