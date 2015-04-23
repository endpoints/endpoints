export default function (file) {
  try {
    return require(file);
  } catch (e) {
    return e;
  }
}
