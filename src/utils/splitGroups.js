export default function splitGroups(arr, count) {
  const groups = (new Array(count)).fill(undefined).map(() => []);
  arr.forEach((p, i) => {
    groups[i % groups.length].push(p);
  });
  return groups;
}
