describe('creatingResources', function() {
  it('must have a JSON object at the root of every response');
  it('must not include any top-level members other than "data," "meta," or "links," "linked"');

  it('should allow resources of a given type to be created');
  it('must require a content-type header of application/vnd.api+json');
  it('must require relevant extensions in the content-type header');
  it('must require a single resource object as primary data');
  it('must not allow partial updates');
  it('must require a type member of the data');

  describe('clientGeneratedIds', function() {
    // A server MAY accept a client-generated ID along with a
    // request to create a resource. An ID MUST be specified
    // with an "id" key, the value of which MUST be a
    // universally unique identifier. The client SHOULD use a
    // properly generated and formatted UUID as described in RFC
    // 4122 [RFC4122].
    it('must return 403 Forbidden in response to an unsupported request using a client-generated ID');
  });

  describe('responses', function() {

    describe('201Created', function() {
      it('must respond to a successful resource creation');
      it('must include a Location header identifying the location of the new resource');
      it('must respond with 201 on a successful request if the request did not include a client-generated ID');
      it('must include a document containing the primary resource created');
      it('must make the self link and Location header the same');
    });

    describe('204NoContent', function() {
      it('must respond with either 201 or 204 if the request included a client-generated ID');
    });

    describe('403Forbidden', function() {
      it('should return 403 Forbidden in response to an unsupported creation request');
    });

    describe('409Conflict', function() {
      it('must return 409 Conflict when processing a request to create a resource with an existing client-generated ID');
      it('must return 409 Conflict when processing a request where the type does not match the endpoint');
    });

    describe('otherResponses', function() {
      it('should use other HTTP codes to represent errors');
      it('must interpret errors in accordance with HTTP semantics');
      it('should return error details');
    });
  });
});
