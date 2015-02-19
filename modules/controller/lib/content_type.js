module.exports = function(request) {
  var err;
  var requiredType = 'application/vnd.api+json';
  var headers = request.headers;
  var contentType = headers['content-type'];
  var accepts = headers.accept || '';

  var isValidContentType = (
    contentType &&
    contentType.toLowerCase().indexOf(requiredType) === 0
  );
  var isBrowser = accepts.indexOf('text/html') !== -1;

  if (!isBrowser && !isValidContentType) {
    err = new Error('Content-Type must be "application/vnd.api+json"');
    err.httpStatus = 415;
    err.title = 'Unsupported Media Type';
  }

  return err;
};
