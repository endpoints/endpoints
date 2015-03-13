# Step 3: Endpoints Controller

In our author module directory, create a file called
`controller.js`:

    const Endpoints = require('endpoints');

    module.exports = new Endpoints.Controller({
      adapter: new Endpoints.BookshelfAdapter({
        model: require('./model')
      })
    });

This file exposes the data in our Bookshelf Model, 
wrapped by the [Endpoints.Adapter](/api/endpoints/0.5.6/Adapter.html) to

