const EXPECTED_TYPE = 'application/vnd.api+json';

module.exports = function(request) {
  var err;

  var contentType = request.headers['content-type'];

  var isValidContentType = (
    contentType &&
    contentType.toLowerCase().indexOf(EXPECTED_TYPE) === 0
  );

  if (!isValidContentType) {
    err = new Error('Content-Type must be "' + EXPECTED_TYPE + '"');
    err.httpStatus = 415;
    err.title = 'Unsupported Media Type';
  }

  return err;
};
