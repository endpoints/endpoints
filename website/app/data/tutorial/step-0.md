# Step 0: Hello, Express!

Endpoints is built to work on top of a NodeJS based framework; currently
both Express and Hapi are supported.

In this tutorial, we'll be using endpoints on top of Express to make an
API for data on fantasy-genre books. We'll be building this application
on a stack of Express, Knex, Bookshelf, and finally endpoints. Therefore, 
we'll begin by setting up a layered Express application.

[Here is the github diff of what we'll do in this section.](https://github.com/endpoints/tutorial/commit/7249ed4786fe6220ad439bec1bbbb98faec9697b)

If you are already familiar with Express, feel free to skip to the next
step! This tutorial presents a very opinionated way to write Express 
apps, so you may be interested in scanning this section to get a sense
of how we organize our application.

### package.json

In the root folder of your application directory, create a `package.json`
file with your application's information. Add express as a dependency to
your application by typing the following:

`npm install express ^4.12.2 --save`

### Express Application(s!)

When creating an Express application, we can take advantage of the layered
structure of the web to make our application modular and easier to test.
We'll write 2 `index.js` files each containing an Express application: the
first will simply start up a web server, and the second will contain the 
information for our API.

#### Express Server

The first application we'll build will simply handle starting a web server
for us. In the root of our application directory, create an `index.js` file
and enter the following code:


    // index.js
    const port = process.env.PORT || '8080';
    const host = process.env.HOST || '0.0.0.0';
    const express = require('express');
    const app = express();

    app.listen(port, host);

    console.log('Server running on, %s:%d', host, port);


This code creates an express application(`const app = express()`) and 
starts a web server on port `8080`, host `0.0.0.0` (unless host and port
are otherwise specficied by an `env` variable). 

To test that this works, run `node index.js` in the root of your application.
You should see "`Server running on, 0.0.0.0:8080`" logged in your server 
console.

#### `npm start` script

To simplify our application, let's add a npm script to start our application.
Inside your `package.json` add the following:


    // package.json
    // ...
      "scripts": {
        "start": "node index.js"
      },
    // ...


This code creates a script alias, `npm start`, that will run our `node index.js`
command. To test it, type `npm start`. If all is still working, you should see
"`Server running on, 0.0.0.0:8080`" logged in your server console, just like
before.

This is a nice convenience to have, as we'll be able to start our application
from any location within our application directory.

#### Express API

The second Express appliation we'll make is the applicaiton that will serve
our API. We'll keep all of our API application files in a directory called 
`src`.

Make a file called `src/index.js` and enter the following code:


    // src/index.js
    const express = require('express');
    const app = express();

    app.get('/', function(req,res){
      res.send('hello Express!');
    });

    module.exports = app;


This code will create another Express application. It will register a single
route, '/', which will respond with the string `"hello Express!"`. We'll
export this Express application with the line `module.exports = app` so that
we can use it in the previous application we wrote.

#### Wiring it together

Now we'll tell our original Express application to use the app we just wrote.
Back in `index.js` in the root of our application, we'll add
`app.use(require('./src'))`. Our final `index.js` will read like this:


    // index.js
    const port = process.env.PORT || '8080';
    const host = process.env.HOST || '0.0.0.0';
    const express = require('express');
    const app = express();

    app.listen(port, host);

    app.use(require('./src'));

    console.log('Server running on, %s:%d', host, port);


To test this, we'll start our application just as before, typing `npm start`.

If it's working correctly, you should see "hello Express!" in your browser at
`0.0.0.0:8080`.


[Review what we've done in this section by checking out the github diff.](https://github.com/endpoints/tutorial/commit/7249ed4786fe6220ad439bec1bbbb98faec9697b)

Now that we have a basic Express application(s!) set up we are ready to start
building an API with endpoints!
