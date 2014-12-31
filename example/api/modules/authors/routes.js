const controller = require('./controller');
const booksController = require('../books/controller');
const chaptersController = require('../chapters/controller');

module.exports = {
  post: {
    '/': controller.create({method: 'createWithRandomBook'})
  },
  get: {
    '/': controller.read(),
    '/:id': controller.read({one: true}),
    // this is a cool/clever idea, but it doesn't work for the inverse relations
    '/:author_id/books': booksController.read(),
    '/:author_id/books/:id': booksController.read({one:true}),
    '/:author_id/books/:book_id/chapters': chaptersController.read()
  },
  put: {
    '/:id': controller.update()
  },
  delete: {
    '/:id': controller.destroy()
  }
};
