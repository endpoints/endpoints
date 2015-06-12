describe('baseFormat', function() {

  describe('contentNegotiation', function() {

    it('must send all JSON API data in response documents with the header `Content-Type: application/vnd.api+json` without any media type parameters');

    it('must respond with a `415 Unsupported Media Type` status code if a request specifies the header `Content-Type: application/vnd.api+json` with any media type parameters');

    it('respond with a `406 Not Acceptable` status code if a request\'s `Accept` header contains the JSON API media type and all instances of that media type are modified with media type parameters');

  });

  describe('documentStructure', function() {

    it('Unless otherwise noted, objects defined by this specification **MUST NOT** contain any additional members.');

    it('Client and server implementations **MUST** ignore  members not recognized by this specification.');

    // This will be tested by including the following expectation in every other test expecting response data:
    // - expect(res.body).to.be.an('object');
    // it('A JSON object MUST be at the root of every JSON API request and response containing data. This object defines a document\'s "top level".');

    it('A document **MUST** contain at least one of the following top-level members:\\n\\n- `data`: the document\'s "primary data"\\n- `errors`: an array of error objects\\n- meta`: a meta object that contains non-standard meta-information.');

    it('The members `data` and `errors` **MUST NOT** coexist in the same document.');

    it('A document **MAY** contain any of these top-level members:\\n\\n- `jsonapi`: an object describing the server\'s implementation\\n- `links`: a links object related to the primary data.\\n- `included`: an array of resource objects that are related to the primary data and/or each other ("included resources").');

    it('If a document does not contain a top-level `data` key, the `included` member **MUST NOT** be present either.');

    it('The top-level links object **MAY** contain the following members:\\n\\n- `self`: the link that generated the current response document.\\n- `related`: a related resource link when the primary data represents a resource relationship.\\n- pagination links for the primary data.');

    it('Primary data **MUST** be either:\\n\\n- a single resource object, a single resource identifier object, or `null`, for requests that target single resources\\n- an array of resource objects, an array of resource identifier objects, or an empty array (`[]`), for requests that target resource collections');

    it('A logical collection of resources **MUST** be represented as an array, even if it only contains one item or is empty.');

    it('A resource object MUST contain at least the following top-level members:\\n\\n- `id`\\n- `type`\\n\\nException: The `id` member is not required when the resource object originates at the client and represents a new resource to be created on the server.');

    it('In addition, a resource object MAY contain any of these top-level members:\\n\\n- `attributes`: an attributes object representing some of the resource\'s data.\\n- `relationships`: a relationships object describing relationships between the resource and other JSON API resources.\\n -`links`: a links object containing links related to the resource.\\n- `meta`: a meta object containing non-standard meta-information about a resource that can not be represented as an attribute or relationship.');

    it('Every resource object **MUST** contain an `id` member and a `type` member.');

    it('The values of the `id` and `type` members **MUST** be strings.');

    it('Within a given API, each resource object\'s `type` and `id` pair **MUST** identify a single, unique resource. (The set of URIs controlled by a server, or multiple servers acting as one, constitute an API.)');

    it('The values of `type` members **MUST** adhere to the same constraints as member names.');

    it('Fields for a resource object **MUST** share a common namespace with each other and with `type` and `id`. In other words, a resource can not have an attribute and relationship with the same name, nor can it have an attribute or relationship named `type` or id.');

    it('The value of the `attributes` key **MUST** be an object (an "attributes object").');

    it('any object that constitutes or is contained in an attribute **MUST** reserve the `relationships` and `links` members for future use.');

    it('Although has-one foreign keys (e.g. author_id) are often stored internally alongside other information to be represented in a resource object, these keys **SHOULD NOT** appear as attributes.');

    it('The value of the `relationships` key **MUST** be an object (a "relationships object").');

    it('A "relationship object" **MUST** contain at least one of the following:]\\n\\n- `links`: a links object containing at least one of the following:\\n  - `self`: a link for the relationship itself (a "relationship link"). This link allows the client to directly manipulate the relationship. For example, it would allow a client to remove an author from an article without deleting the people resource itself.\\n  - `related`: a related resource link\\n- `data`: resource linkage\\n- `meta`: a meta object that contains non-standard meta-information about the relationship.');

    it('A relationship object that represents a to-many relationship **MAY** also contain pagination links under the links member');

    it('If present, a related resource link **MUST** reference a valid URL, even if the relationship isn\'t currently associated with any target resources.');

    it('a related resource link **MUST NOT** change because its relationship\'s content changes.');

    it('Resource linkage MUST be represented as one of the following:\\n\\n- `null` for empty to-one relationships.\\n- an empty array (`[]`) for empty to-many relationships.\\n- a single resource identifier object for non-empty to-one relationships.\\n- an array of resource identifier objects for non-empty to-many relationships.');

    it('If present, this links object **MAY** contain a `self` link that identifies the resource represented by the resource object.');

    it('A server **MUST** respond to a `GET` request to the specified URL with a response that includes the resource as the primary data.');

    it('A "resource identifier object" **MUST** contain type and id members.');

    it('A "resource identifier object" **MAY** also include a meta member, whose value is a meta object that contains non-standard meta-information.');

    it('To reduce the number of HTTP requests, servers **MAY** allow responses that include related resources along with the requested primary resources. Such responses are called "compound documents".');

    it('In a compound document, all included resources **MUST** be represented as an array of resource objects in a top-level `included` member.');

    it('Compound documents require "full linkage", meaning that every included resource **MUST** be identified by at least one resource identifier object in the same document. These resource identifier objects could either be primary data or represent resource linkage contained within primary or included resources. The only exception to the full linkage requirement is when relationship fields that would otherwise contain linkage data are excluded via sparse fieldsets.');

    it('A compound document **MUST NOT** include more than one resource object for each type and id pair.');

    it('The value of each meta member **MUST** be an object (a "meta object").');

    it('Any members **MAY** be specified within meta objects.');

    it('The value of each links member **MUST** be an object (a "links object").');

    it('Each member of a links object is a "link". A link **MUST** be represented as either:\\n\\n- a string containing the link\'s URL.\\n- an object ("link object") which can contain the following members:\\n  - `href`: a string containing the link\'s URL.\\n  - `meta`: a meta object containing non-standard meta-information about the link.');

    it('A JSON API document **MAY** include information about its implementation under a top level `jsonapi` member.');

    it('If present, the value of the `jsonapi` member **MUST** be an object (a "jsonapi object")');

    it('The jsonapi object **MAY** contain a `version` member whose value is a string indicating the highest JSON API version supported.');

    it('The jsonapi object **MAY** also contain a `meta` member, whose value is a meta object that contains non-standard meta-information.');

    it('All member names used in a JSON API document **MUST** be treated as case sensitive by clients and servers');

    it('Member names **MUST** contain at least one character.');

    it('Member names **MUST** contain only the allowed characters listed below.');

    it('Member names MUST start and end with a "globally allowed character", as defined below.');

    it('it is **RECOMMENDED** that member names use only non-reserved, URL safe characters specified in RFC 3986.');

    it('The following "globally allowed characters" **MAY** be used anywhere in a member name:\\n\\n- U+0061 to U+007A, "a-z"\\n- U+0041 to U+005A, "A-Z"\\n- U+0030 to U+0039, "0-9"\\n- any UNICODE character except U+0000 to U+007F (not recommended, not URL safe)');

    it('The following characters **MUST NOT** be used in member names:\\n\\n- U+002B PLUS SIGN, "+" (used for ordering)\\n- U+002C COMMA, "," (used separator for multiple relationship paths)\\n- U+002E PERIOD, "." (used as relationship path separators)\\n- U+005B LEFT SQUARE BRACKET, "[" (use in sparse fieldsets)\\n- U+005D RIGHT SQUARE BRACKET, "]" (used in sparse fieldsets)\\n- U+0021 EXCLAMATION MARK, "!"\\n- U+0022 QUOTATION MARK, \""\"\\n- U+0023 NUMBER SIGN, "#"\\n- U+0024 DOLLAR SIGN, "$"\\n- U+0025 PERCENT SIGN, "%"\\n- U+0026 AMPERSAND, "&"\\n- U+0027 APOSTROPHE, "\'"\\n- U+0028 LEFT PARENTHESIS, "("\\n- U+0029 RIGHT PARENTHESIS, ")"\\n- U+002A ASTERISK, "*"\\n- U+002F SOLIDUS, "/"\\n- U+003A COLON, ":"\\n- U+003B SEMICOLON, ";"\\n- U+003C LESS-THAN SIGN, "<"\\n- U+003D EQUALS SIGN, "="\\n- U+003E GREATER-THAN SIGN, ">"\\n- U+003F QUESTION MARK, "?"\\n- U+0040 COMMERCIAL AT, "@"\\n- U+005C REVERSE SOLIDUS, "\\"\\n- U+005E CIRCUMFLEX ACCENT, "^"\\n- U+0060 GRAVE ACCENT, "`"\\n- U+007B LEFT CURLY BRACKET, "{"\\n- U+007C VERTICAL LINE, "|"\\n- U+007D RIGHT CURLY BRACKET, "}"\\n- U+007E TILDE, "~"');
  });

  require('./read');

  describe('creatingUpdatingAndDeletingResources', function() {

    it('may allow resources of a given type to be created.');

    it('may also allow existing resources to be modified or deleted.');

    it('A request **MUST** completely succeed or fail (in a single "transaction"). No partial updates are allowed.');

    require('./create');
    require('./update');
    require('./delete');
  });

  require('./query-parameters');
  require('./errors');
});


/* OLD DOCUMENT STRUCTURE TESTS
   TODO: SHOULD TEST ALL METHODS, NOT JUST GET
  describe('documentStructure', function() {

    describe('resourceObjects', function() {

      describe('resourceAttributes', function() {
        it('should not contain a foreign key as an attribute', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj).to.be.an('object');
              expect(dataObj.attributes).to.not.have.property('author_id');
              expect(dataObj.attributes).to.not.have.property('series_id');
            });
        });

        it('must include relations as included resources', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj).to.be.an('object');
              expect(dataObj.relationships).to.have.property('author');
              expect(dataObj.relationships).to.have.property('series');
            });
        });
      });

      describe('resourceTypes', function() {
        it('must contain a type', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj)
                .to.have.property('type')
                  // must have a string value for type
                  .that.is.a('string');
            });
        });
      });

      describe('resourceIds', function() {
        it('must contain an id', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj)
                .to.have.property('id')
                  // must have a string value for type
                  .that.is.a('string');
            });
        });
      });

      describe('relationships', function() {
        it('must have an object as the value of any relationships key', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj)
                .to.have.property('relationships')
                  // must have a string value for type
                  .that.is.a('object');
            });
        });
      });

      describe('resourceURLs', function() {
        // OPTIONAL
        // A resource object **MAY** include a URL in its links object,
        // keyed by "self", that identifies the resource represented by
        // the resource object.
        it('may include a string in its links object keyed by "self"', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.links)
                .to.have.property('self')
                  // must have a string value for type
                  .that.is.a('string');
            });
        });

        it('must set the value of "self" to a URL that identifies the resource represented by this object', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.links.self).to.equal('/v1/books/1');
            });
        });

      });

      describe('resourceRelationships', function() {
        // OPTIONAL
        // A resource object MAY contain references to other resource
        // objects ("relationships"). Relationships may be to-one or
        // to-many. Relationships can be specified by including a member
        // in a resource's links object.
        it('may contain references to related objects in the links object', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var relationships = res.body.data.relationships;
              expect(res.status).to.equal(200);
              expect(relationships).to.have.property('author');
              expect(relationships).to.have.property('series');
              expect(relationships).to.have.property('stores');
            });
        });

        // https://github.com/json-api/json-api/commit/6b18a4685692ae260f0ef1e10522b81725f83219
        it('may include a related resource URL in its links object keyed by "related"', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.relationships.chapters.links).to.have.property('related');
            });
        });

        it('may include a "data" member whose value represents resource identifier objects', function() {
          return Agent.request('GET', '/v1/books/1?include=author')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.relationships.author).to.have.property('data');
            });
        });

        // The value of a relationship **MUST** be either a string URL
        // or a link object.
        //
        // Endpoints takes the view that to-many relationships may
        // contain numerous records. By default, it returns link objects
        // for to-one references and string URLs for to-many references.
        it('should make to-one references in a relationship object', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var relationships = res.body.data.relationships;
              expect(res.status).to.equal(200);
              expect(relationships.author).to.be.an('Object');
              expect(relationships.series).to.be.an('Object');
            });
        });

        it('should make to-many references in a relationships object', function() {
          return Agent.request('GET', '/v1/books/1')
            .promise()
            .then(function(res) {
              var relationships = res.body.data.relationships;
              expect(res.status).to.equal(200);
              expect(relationships.stores).to.be.an('Object');
            });
        });

        it('should return related resources as the response primary data when a to-One string URL is fetched', function() {
          return Agent.request('GET', '/v1/books/1/author')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.id).to.equal('1');
              expect(dataObj.type).to.equal('authors');
            });
        });

        it('should return related resources as the response primary data when a to-Many string URL is fetched', function() {
          return Agent.request('GET', '/v1/books/1/stores')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.length).to.equal(1);
              expect(dataObj[0].type).to.equal('stores');
            });
        });

        it('should return related resources as the response primary data when a nested string URL through a to-One is fetched', function() {
          return Agent.request('GET', '/v1/chapters/1/book.author')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.id).to.equal('1');
              expect(dataObj.type).to.equal('authors');
            });
        });

        it('should return related resources as the response primary data when a nested string URL through a to-Many is fetched', function() {
          return Agent.request('GET', '/v1/books/1/stores.books')
            .promise()
            .then(function(res) {
              var dataObj = res.body.data;
              expect(res.status).to.equal(200);
              expect(dataObj.length).to.equal(11);
              expect(dataObj[0].type).to.equal('books');
            });
        });

        describe('relationshipObject', function() {
          it('must contain either a "links,", "data", or "meta" property', function() {
            return Agent.request('GET', '/v1/books/1')
              .promise()
              .then(function(res) {
                expect(res.status).to.equal(200);
                var dataObj = res.body.data;
                var includedAuthor = dataObj.relationships.author;
                var minProp =
                  includedAuthor.links ||
                  includedAuthor.data ||
                  includedAuthor.meta;
                expect(minProp).to.exist;
              });
          });

          it('must include object linkage to resource objects included in the same compound document', function() {
            return Agent.request('GET', '/v1/books/1?include=author')
              .promise()
              .then(function(res) {
                var dataObj = res.body.data;
                expect(res.status).to.equal(200);
                var includedAuthor = dataObj.relationships.author;

                expect(includedAuthor.data).to.exist;
              });
          });

          it('must express object linkages as type and id for all relationship types', function() {
            return Agent.request('GET', '/v1/books/1?include=author,series')
              .promise()
              .then(function(res) {
                var dataObj = res.body.data;
                var links = dataObj.relationships;
                expect(res.status).to.equal(200);
                expect(links.author.data).to.have.property('type');
                expect(links.author.data).to.have.property('id');
                expect(links.series.data).to.have.property('type');
                expect(links.series.data).to.have.property('id');
              });
          });
        });
      });
    });

    describe('compoundDocuments', function() {
      // An endpoint **MAY** return resources included to the primary data
      // by default.
      //
      // Endpoints handles this by allowing the API implementer to set
      // default includes in the router. Endpoints will not include
      // included resources by default.
      //
      // An endpoint MAY also support custom inclusion of included
      // resources based upon an include request parameter.
      it('must include included resources as an array of resource objects in a top level `included` member', function() {
        return Agent.request('GET', '/v1/books/1?include=author')
          .promise()
          .then(function(res) {
            var dataObj = res.body.data;
            expect(res.status).to.equal(200);
            var includedAuthorLinkage = dataObj.relationships.author.data;
            expect(res.body.included).to.be.a('array');
            expect(res.body.included[0].type).to.equal(includedAuthorLinkage.type);
            expect(res.body.included[0].id).to.equal(includedAuthorLinkage.id);
          });
      });

      it('must not include more than one resource object for each type and id pair', function() {
        return Agent.request('GET', '/v1/books?include=author')
          .promise()
          .then(function(res) {
            expect(res.status).to.equal(200);
            expect(res.body.included.length).to.equal(2);
          });
      });
    });

    it('must have the identical relationship name as the key in the relationships section of the parent resource object', function() {
      return Agent.request('GET', '/v1/books/1?include=author,series,stores')
        .promise()
        .then(function(res) {
          var relationships = Object.keys(res.body.data.relationships);
          expect(res.status).to.equal(200);
          expect(relationships.indexOf('author')).to.be.at.least(0);
          expect(relationships.indexOf('series')).to.be.at.least(0);
          expect(relationships.indexOf('stores')).to.be.at.least(0);
        });
    });
  });
*/
