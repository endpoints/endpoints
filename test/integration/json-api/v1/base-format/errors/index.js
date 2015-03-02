describe('errors', function() {
  it('should return error objects that include additional information about problems encountered');
  it('should not return errors with primary data');
  it('should have an id member');
  it('should have a href member with further details of the problem');
  it('should have a status member representing the string value of an HTTP status code');
  it('should have a code member representing an application-specific error code');
  it('should have a title member representing a short summary of the problem');
  it('should have a detail member representing a human-readable explanation of the problem');
  it('should have a links member representing an array of pointers to the associated resources');
  it('should have a paths member representing an array of pointers to the relevant attributes within the resource');
});
