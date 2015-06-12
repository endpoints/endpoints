// TODO: Implement
describe('errors', function() {

  it('Implementation specific query parameters **MUST** adhere to the same constraints as member names with the additional requirement that they **MUST** contain at least one non a-z character (U+0061 to U+007A).');

  it('It is RECOMMENDED that a U+002D HYPHEN-MINUS, \"-\", U+005F LOW LINE, \"_\", or capital letter is used (e.g. camelCasing).');

  it('If a server encounters a query parameter that does not follow the naming conventions above, and the server does not know how to process it as a query parameter from this specification, it **MUST** return `400 Bad Request`.');
});
