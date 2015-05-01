import Application from './application';
import Controller from './controller';
import BookshelfStore from './store-bookshelf';
import JsonApiFormat from './format-jsonapi';
import ValidateJsonSchema from './validate-json-schema';

export default {
  Application,
  Controller,
  Store: {
    bookshelf: BookshelfStore
  },
  Format: {
    jsonapi: JsonApiFormat
  },
  ValidateJsonSchema
};
