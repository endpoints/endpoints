import RequestHandler from '../../request-handler';
import PayloadHandler from '../../payload-handler';
import * as send from './send';

module.exports = function (config, baseUrl) {
  const {method, responder, format, store} = config;
  const requestHandler = new RequestHandler(config);
  const payloadHandler = new PayloadHandler(
    new format({
      store: store,
      baseUrl: baseUrl
    })
  );

  return function (request, response) {
    const server = 'express'; // detect if hapi or express here
    const modelHandlers = config.model.methodHandlers;
    const process = modelHandlers && modelHandlers[method] ?
      modelHandlers[method].request.bind(requestHandler) :
      requestHandler[method].bind(requestHandler);
    const format = modelHandlers && modelHandlers[method] ?
      modelHandlers[method].payload.bind(payloadHandler, config) :
      payloadHandler[method].bind(payloadHandler, config);
    const respond = (responder ? responder : send[server]).bind(null, response);
    const errors = requestHandler.validate(request);

    if (errors) {
      respond(payloadHandler.error(errors));
    } else {
      process(request)
        .then(format)
        .then(respond)
        .catch(function (err) {
          //throw err;
          return respond(payloadHandler.error(err));
        });
    }
  };
};
