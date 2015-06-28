function send (response, payload) {
  const {code, data, headers} = payload;

  if (headers) {
    response.set(headers);
  }
  return response.status(code).send(data);
}

export default function (buildPayload) {
  return (request, response) => {
    const respond = send.bind(null, response);
    buildPayload(request).then(respond);
  };
}
