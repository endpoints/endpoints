module.exports = function(req, res, source) {
  var err;
  var relations = source.relations();
  var relation = req.params ? req.params.relation : null;

  // this is a hot mess, but it works as a proof of concept
  if (relations.indexOf(relation) === -1) {
    // TODO: don't respond here
    err = new Error('???');
    err.httpStatus = '???',
    err.title = '???';
    return err;
  }
};
