describe('recommendations', function() {

  describe('naming', function() {
    it('should use dasherized resource types');
    it('should use dasherized attribute names');
    it('should use dasherized association names');
    it('should pluralize resource types');
  });

  describe('urlDesign', function() {

    describe('referenceDocument', function() {
      it('should have a reference document');
    });

    describe('urlsForResourceCollections', function() {
      it('should form the URL for a collection from the resource type');
    });

    describe('urlsForIndividualResources', function() {
      it('should form the URL for an individual resource by appending the ID to the collection URL');
    });

    describe('relationshipURLsAndRelatedResourceURLs', function() {
      it('should form a relationshipURL by appending `/links/` and the name of the relationship to the resource URL');
      it('should form a related resource URL by appending the name of the relationship to the resource URL');
      it('should not use these relationship URLs as self links for the related resources');
    });

    describe('recommendationsForFiltering', function() {
      it('should filter using query parameters that combine `filter` with the association name');
      it('should allow multiple filter values in a comma-separated list');
      it('should allow multiple filters in a single request');
    });
  });
});
