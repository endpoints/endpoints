import Kapow from 'kapow';

export default function byId (model, id, relations) {
  return model.collection().query(function (qb) {
     return qb.where({id:id});
   }).fetchOne({
     withRelated: relations
   }).catch(TypeError, function(e) {
     // A TypeError here most likely signifies bad
     // relations passed into withRelated
     throw Kapow(404, 'Unable to find relations');
   });
}
