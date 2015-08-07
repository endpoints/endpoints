import RequestHandler from '../../request-handler';
import PayloadHandler from '../../payload-handler';
import buildPayload from './build_payload';

module.exports = function (config, baseUrl) {
  const {method, responder, format, store} = config;
  const requestHandler = new RequestHandler(config);
  const payloadHandler = new PayloadHandler(
    new format({
      store: store,
      baseUrl: baseUrl
    })
  );

  const validate = requestHandler.validate.bind(requestHandler);
  const process = requestHandler[method].bind(requestHandler);
  const formatPayload = payloadHandler[method].bind(payloadHandler, config);
  const error = payloadHandler.error.bind(payloadHandler);

  const buildPayloadCurried = buildPayload.bind(null, validate, process, formatPayload, error);


  return responder(buildPayloadCurried);
};
