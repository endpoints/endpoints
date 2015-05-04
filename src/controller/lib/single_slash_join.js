export default function (input=[]) {
  if (!Array.isArray(input)) {
    throw new Error('Input must be an array.');
  }
  return '/' + input.join('/').replace(/^\/+|\/+$|(\/)+/g, '$1');
}
