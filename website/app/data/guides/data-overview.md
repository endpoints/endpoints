# Dataflow Overview

The endpoints stack/framework is a series of wrappers and 
conversions that allow one to work with node on top of a
relational database.

Given this, understanding how information is passed through
the endpoints application stack, from request to response, 
can help one understand how endpoints works, as well as what
its value proposition is.

1. The Express application recieves a Request object from 
the client. The Request is made up of a HTTP method and a
URI. The Express application matches the HTTP method and URI
to a CRUD http method off of an Endpoints.Controller object.

2. The Endpoints.Controller method is matched with a method
on Endpoints.BookshelfAdapter of the same name which interfaces
with the Bookshelf method of the same name.

3. The data is handled via the Bookshelf ORM through the
Bookshelf.Model to the Knex query builder, and finally to the
database.

4. The database returns data via the Bookshelf ORM.

5. ResponseFormatter which takes the json-api spec formatter
as a paramter returns json-api compliant JSON response

6. The Endpoints.Controller receives the formatted Response
and hands it back to the Express application

7. The Express application sends the JSON to back to the 
client that requested it.
