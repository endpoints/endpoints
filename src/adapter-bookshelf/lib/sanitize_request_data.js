export default function(data) {
  delete data.type;
  delete data.links;
  return data;
}
