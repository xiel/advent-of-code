export function sum(a: number, b: number) {
  return a + b;
}

export function asc(a: number, b: number) {
  if (a < b) return -1;
  if (a === b) return 0;
  return +1;
}

export function desc(a: number, b: number) {
  if (a > b) return -1;
  if (a === b) return 0;
  return +1;
}
