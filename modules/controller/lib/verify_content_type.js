const EXPECTED_TYPE = 'application/vnd.api+json';

module.exports = function(contentType) {
  var err;

  var isValidContentType = (
    contentType &&
    contentType.toLowerCase().indexOf(EXPECTED_TYPE) === 0
  );

  if (!isValidContentType) {
    err = new Error('Content-Type must be "application/vnd.api+json"');
    err.httpStatus = 415;
    err.title = 'Unsupported Media Type';
  }

  return err;
};
