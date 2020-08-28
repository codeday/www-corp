export function dedupeFirstByKey(obj, key) {
  const uniq = {};
  obj.forEach((el) => {
    if (!(el[key] in uniq)) {
      uniq[el[key]] = el;
    }
  });
  return Object.values(uniq);
}
