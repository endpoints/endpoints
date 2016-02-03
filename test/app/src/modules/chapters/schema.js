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
        }
      },
      relationships: {
        required: false,
        type: 'object',
      }
    }
  }
};
