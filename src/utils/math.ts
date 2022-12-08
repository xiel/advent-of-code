export function sum(a: number, b: number) {
  return a + b;
}

export function product(a: number, b: number) {
  return a * b;
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

export function by<O, K extends keyof O>(
  key: K,
  compareFn: (a: O[K], b: O[K]) => number
) {
  return (a: O, b: O) => compareFn(a[key], b[key]);
}
