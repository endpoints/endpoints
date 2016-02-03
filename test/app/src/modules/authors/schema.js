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
              date_of_birth: {
                type: 'string',
                format: 'date-time'
              },
              date_of_death: {
                type: 'string',
                format: 'date-time'
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
