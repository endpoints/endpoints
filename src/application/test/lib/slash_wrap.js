import {expect} from 'chai';

import slashWrap from '../../lib/slash_wrap';

describe('slashWrap', () => {

  it('should ensure a string is wrapped with a single slash', () => {
    expect(slashWrap()).to.equal('/');
    expect(slashWrap('foo')).to.equal('/foo/');
    expect(slashWrap('/foo')).to.equal('/foo/');
    expect(slashWrap('foo/')).to.equal('/foo/');
    expect(slashWrap('/foo/')).to.equal('/foo/');
    expect(slashWrap('//foo')).to.equal('/foo/');
    expect(slashWrap('foo//')).to.equal('/foo/');
    expect(slashWrap('//foo//')).to.equal('/foo/');
  });

});
