import bPromise from 'bluebird';

export default function (model) {
  const columns = model.constructor.columns;
  // populate the field listing for a table so we know which columns
  // we can use for sparse fieldsets.
  if (!columns) {
    return model.query().columnInfo().then(function (info) {
      model.constructor.columns = Object.keys(info);
      return model.constructor.columns;
    });
  }
  return bPromise.resolve(columns);
}
