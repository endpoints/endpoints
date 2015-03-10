const Request = require('../../request');
const Response = require('../../response');

module.exports = function (config, source) {
  var responder = config.responder;

  return function (req, res) {
    var request = new Request(req, config, source);
    var response = new Response(res);
    var method = config.method;
    var server = 'express';

    var processRequest = request[method].bind(request);
    var formatResponse = response[method].bind(response, config);
    var sendResponse = responder ? responder: response[server].bind(response);

    var errors = request.validate();

    if (errors) {
      sendResponse(Response.error(errors));
    } else {
      processRequest().
        then(formatResponse).
        then(sendResponse).
        catch(function (result) {
          return sendResponse(Response.error(result));
        });
    }
  };
};
