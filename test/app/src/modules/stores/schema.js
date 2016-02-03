module.exports = {
  body: {
    required: true,
    type: 'object',
    properties: {
      data: {
        required: true,
        type: 'object',
        properties: {
          type: {
            required: true,
            type: 'string'
          },
          attributes: {
            required: true,
            type: 'object',
            properties: {
              id: {
                type: 'integer'
              },
              name: {
                type: 'string'
              },
            }
          }
        }
      },
      relationships: {
        required: false,
        type: 'object',
      }
    }
  }
};
