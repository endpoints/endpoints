module.exports = {
  body: {
    properties: {
      id: {
        type: 'integer'
      },
      title: {
        type: 'string'
      },
      ordering: {
        type: 'string',
        format: 'date-time'
      },
      links: {
        author: {
          type: 'string'
        }
      }
    }
  }
};
