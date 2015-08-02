import Application from './application';
import Resource from './resource';
import Controller from './controller';
import BookshelfStore from './store-bookshelf';
import JsonApiFormat from './format-jsonapi';
import ValidateJsonSchema from './validate-json-schema';
import ExpressResponder from './responder-express';
import KoaResponder from './responder-koa';
import HapiResponder from './responder-hapi';

export default {
  Application,
  Controller,
  Resource,
  Store: {
    bookshelf: BookshelfStore
  },
  Format: {
    jsonapi: JsonApiFormat
  },
  Responder: {
    hapi: HapiResponder,
    express: ExpressResponder,
    koa: KoaResponder
  },
  ValidateJsonSchema
};
