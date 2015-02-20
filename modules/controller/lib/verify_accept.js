const EXPECTED_ACCEPT = 'application/vnd.api+json';

module.exports = function(request) {
  var err;

  var headers = request.headers;
  var accept = headers.accept;
  var isBrowser = headers.accepts && headers.accepts.indexOf('text/html') !== -1;

  var isValidAccept = (
    accept &&
    accept.toLowerCase().indexOf(EXPECTED_ACCEPT) === 0
  );

  if (!isValidAccept && !isBrowser) {
    err = new Error('Content-Type must be "' + EXPECTED_ACCEPT + '"');
    err.httpStatus = 406;
    err.title = 'Not Acceptable';
  }

  return err;
};
