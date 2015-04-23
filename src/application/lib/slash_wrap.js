export default function (input) {
  return `/${input || ''}/`.replace(/\/\/+/g, '/');
}
