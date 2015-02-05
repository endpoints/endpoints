const expect = require('chai').expect;

const slashWrap = require('../../lib/slash_wrap');

describe('slashWrap', function () {

  it('should ensure a string is wrapped with a single slash', function () {
    expect(slashWrap()).equals('/');
    expect(slashWrap('foo')).equals('/foo/');
    expect(slashWrap('/foo')).equals('/foo/');
    expect(slashWrap('foo/')).equals('/foo/');
    expect(slashWrap('/foo/')).equals('/foo/');
    expect(slashWrap('//foo')).equals('/foo/');
    expect(slashWrap('foo//')).equals('/foo/');
    expect(slashWrap('//foo//')).equals('/foo/');
  });

});
