describe('deletingResources', function() {
  it('must have a JSON object at the root of every response');
  it('must not include any top-level members other than "data," "meta," or "links," "linked"');

  it('should allow existing resources to be deleted');
  it('must require a content-type header of application/vnd.api+json');
  it('must require relevant extensions in the content-type header');
  it('must not allow partial updates');
  it('should delete resources when a DELETE request is made to the resource URL');

  describe('responses', function() {

    describe('204NoContent', function() {
      it('must return 204 No Content on a successful DELETE request');
    });

    describe('404NotFound', function() {
      it('must return 404 Not Found when processing a request to delete a resource that does not exist');
    });

    describe('otherResponses', function() {
      it('should use other HTTP codes to represent errors');
      it('must interpret errors in accordance with HTTP semantics');
      it('should return error details');
    });
  });
});
