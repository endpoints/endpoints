const TYPE = 'application/vnd.api+json';

function applyHeaders (response, headers) {
  Object.keys(headers).forEach(function(header) {
    response.set(header, headers[header]);
  });
}

export function express (response, payload) {
  const code = payload.code;
  const data = payload.data;
  const headers = payload.headers;
  if (headers) {
    applyHeaders(response, payload.headers);
  }
  return response.set('content-type', TYPE).status(parseInt(code)).send(data);
}

export function hapi (response, payload) {
  const code = payload.code;
  const data = payload.data;
  const headers = payload.headers;
  if (headers) {
    applyHeaders(response, payload.headers);
  }
  return response(data).type(TYPE).code(code);
}
