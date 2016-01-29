import {expect} from 'chai';

import collapseInclude from '../../../../src/request-handler/lib/collapse_include';

describe('collapseInclude', () => {
  it('should turn an array into a unique array of deep includes', () => {
    var input = ['abc', 'mickey.mouse', 'abc.123', 'abc.123.456'];
    var output = ['abc.123.456', 'mickey.mouse'];
    expect(collapseInclude(input)).to.deep.equal(output);
  });
});
