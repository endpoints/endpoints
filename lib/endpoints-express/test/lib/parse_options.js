const parseOptions = require('../../lib/parse_options');

describe('parseOptions', function () {

  it('should throw if no source is specified', function () {
    expect(function () {
      parseOptions();
    }).to.throw('No source specified.');
  });

  it('should throw if no receiver is specified', function () {
    expect(function () {
      parseOptions({
        source: true
      });
    }).to.throw('No receiver specified.');
  });

});
