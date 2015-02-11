describe('patchExtension', function() {
  it('should indicate support for the patch extension by including the header Content-Type application/vnd.api+json; ext=patch in every response');
  it('should allow the client to request the patch extension by specifying the header Accept:application/vnd.api+json; ext=patch');
  it('must return 415 Unsupported if the client requests, but the server does not support the patch extension');

  describe('patchOperations', function() {
    it('must require an array that conforms with JSON Patch format');
    it('should limit type, order, and count of operations');

    describe('requestURLsAndPatchPaths', function() {
      it('must require the requestURL and operations "path" member to combine to target a particular resource, collection, attribute, or relationship');
      it('must allow PATCH requests at any resource or relationship that accepts POST, PUT, or DELETE requests');
      it('should allow PATCH requests at the root URL of the API');
      it('must require each path in a PATCH operation at the root URL to include the full resource path relative to the rootURL');
    });

    describe('creatingResources', function() {
      it('should create resources in a PATCH operation');
    });

    describe('updatingAttributes', function() {
      it('should update attributes in a PATCH operation');
    });

    describe('updatingRelationships', function() {
      it('should support relationship updates at a higher level');

      describe('updatingToOneRelationships', function() {
        it('should update to-one relationships in a PATCH operation');
      });

      describe('updatingToManyRelationships', function() {
        it('should update to-many relationships in a PATCH operation');
        it('must require a "value" member be an object that contains type and ids members or an array of objects with type and id members');
        it('must completely replace every member of a relationship on a "replace" operation OR return 403 Forbidden if not allowed by the server');
      });
    });

    describe('deletingResource', function() {
      it('should delete resources in a PATCH operation');
    });

    describe('responses', function() {

      describe('204NoContent', function() {
        it('must return 204 No Content in a successful PATCH request in which the client\'s attributes remain up to date');
      });

      describe('200Ok', function() {
        it('must return 200 OK if the server accepts the update but also changes the resources in other ways');
        it('must include a representation of the updated resource');
        it('must specify a Content-Type of application/json');
        it('must contain an array of JSON objects in the body of the response');
        it('must conform each JSON object to the JSON API media type');
        it('must include JSON objects in sequential order corresponding to the operations in the request');
      });

      describe('otherResponses', function() {
        it('should specify the most appropriate HTTP error code in each operation\'s response');
        it('should stop processing PATCH operations when the first error is encountered');
        it('should specify the most generally applicable HTTP code in the response');
        it('should return error objects corresponding to each operation');
        it('must contain an array of JSON objects in sequential order corresponding to the request');
        it('should key response objects only on "errors" with no other top-level members');
        it('should return appropriate error codes for each operation in the "status" member of each object');
      });
    });
  });
});
