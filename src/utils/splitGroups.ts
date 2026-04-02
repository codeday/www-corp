export default function splitGroups<T>(arr: T[], count: number): T[][] {
  const groups: T[][] = (new Array(count)).fill(undefined).map(() => []);
  arr.forEach((p, i) => {
    groups[i % groups.length].push(p);
  });
  return groups;
}
