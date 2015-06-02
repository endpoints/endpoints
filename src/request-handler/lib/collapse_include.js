export default function (includes) {
  let memo = {};
  return includes.map(function(include) {
    return include.split('.');
  }).sort(function(a, b) {
    return b.length - a.length;
  }).reduce(function(result, parts) {
    let item;
    let i = parts.length + 1;
    while (--i) {
      item = parts.slice(0, i).join('.');
      if (!memo[item]) {
        memo[item] = true;
        if (i === parts.length) {
          result.push(item);
        }
      }
    }
    return result;
  }, []);
}
