function applyHeaders (response, headers) {
  Object.keys(headers).forEach((header) => {
    response.set(header, headers[header]);
  });
}

function send (response, payload) {
  const {code, data, headers} = payload;
  if (headers) {
    applyHeaders(response, headers);
  }
  return response(data).code(code);
}

export default function (buildPayload) {
  return (request, response) => {
    const respond = send.bind(null, response);
    buildPayload(request).then(respond);
  };
}
