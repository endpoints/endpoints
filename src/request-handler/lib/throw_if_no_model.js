import Kapow from 'kapow';

export default function(model) {
  if (!model) {
    throw Kapow(404, 'Unable to locate model.');
  }

  // Bookshelf throws an error for any number of unrelated reasons.
  // json-api requires we throw specific errors for certain situations.
  if (model instanceof Error) {
    if (
      /No rows were affected/.test(model.message) ||
      /Unable to locate model/.test(model.message)
    ) {
      model = Kapow.wrap(model, 404);
    } else {
      model = Kapow.wrap(model, 500);
    }
    throw model;
  }

  return model;
}
