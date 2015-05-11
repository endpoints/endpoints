import Kapow from 'kapow';

const fkeyCheck = /foreign key constraint/i;
const constraintCheck = /constraint/i;

export default function (model, cb) {
  const transaction = model.transaction || model.constructor.transaction;
  if (!transaction) {
    throw new Error(
      `Please assign Bookshelf.transaction.bind(Bookshelf) to the class
       properties of your base model under the key "transaction".`
    );
  }
  return transaction(cb).catch(function (e) {
    var err = e;
    // rethrow with 404 for fkey constraint failures
    if (fkeyCheck.exec(e.message)) {
      err = Kapow.wrap(e, 404);
    } else if (constraintCheck.exec(e.message)) {
      err = Kapow.wrap(e, 409);
    }
    throw err;
  });
}
