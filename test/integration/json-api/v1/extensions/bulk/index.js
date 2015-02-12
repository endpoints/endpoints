describe('bulkExtension', function() {
  it('should indicate support for the bulk extension by including the header Content-Type: application/vnd.api+json; ext=bulk in every response');
  it('should allow the client to request the bulk extension by specifying the header Accept:application/vnd.api+json; ext=bulk');
  it('must return 415 Unsupported if the client requests, but the server does not support the bulk extension');

  describe('bulkOperations', function() {
    it('must apply requests atomically');
    it('must only succeed if all operations succeed');
    it('must rollback all operations if any operation fails');
  });

  describe('creatingMultipleResources', function() {
    it('must require an array of objects as primary data');
    it('must require a type member in each object');
  });

  describe('updatingMultipleResources', function() {
    it('must require an array of objects as primary data');
    it('must require type and id in each object');
  });

  describe('deletingMultipleResources', function() {
    it('must require a data member as an object with type and ids or an array of objects each with a type and id');
  });
});
