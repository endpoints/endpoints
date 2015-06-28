function send (context, payload) {
  const {code, data, headers} = payload;

  if (headers) {
    context.set(headers);
  }
  context.status = parseInt(code);
  context.body = data;
}

export default function (buildPayload) {
  return function *() {
    const request = {
      body: this.request.body,
      method: this.method,
      query: this.query,
      params: this.params,
      headers: this.headers
    };

    const respond = send.bind(null, this);
    yield buildPayload(request).then(respond);
  };
}
