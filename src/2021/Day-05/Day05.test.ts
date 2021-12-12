import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day 5: Hydrothermal Venture", () => {
  const example = readExampleIntoLines(`
    0,9 -> 5,9
    8,0 -> 0,8
    9,4 -> 3,4
    2,2 -> 2,1
    7,0 -> 7,4
    6,4 -> 2,0
    0,9 -> 2,9
    3,4 -> 1,4
    0,0 -> 8,8
    5,5 -> 8,2
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - At how many points do at least two lines overlap? (horizontal, vertical lines)", () => {
    expect(findHydrothermalVenture(example).countOfOverlaps).toBe(5);
    expect(findHydrothermalVenture(input).countOfOverlaps).toBe(6564);
  });

  test("Part 02 - horizontal, vertical & diagonal lines", () => {
    expect(findHydrothermalVenture(example, false).countOfOverlaps).toBe(12);
    expect(findHydrothermalVenture(input, false).countOfOverlaps).toBe(19172);
  });
});

function findHydrothermalVenture(lines: string[], considerOnlyHVLines = true) {
  const coords = lines.map((l) =>
    l.split(" -> ").map((n) => {
      const [x, y] = n.split(",").map((s) => parseInt(s, 10));
      return { x, y };
    })
  );

  const width = Math.max(...coords.flatMap((c) => c.map((cc) => cc.x))) + 1;
  const height = Math.max(...coords.flatMap((c) => c.map((cc) => cc.y))) + 1;

  const linesToConsider = considerOnlyHVLines
    ? coords.filter(([from, to]) => from.x === to.x || from.y === to.y)
    : coords;

  // Create 2d array width * height dimensions
  const grid: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );

  linesToConsider.forEach(([from, to]) => {
    const xDiff = to.x - from.x;
    const yDiff = to.y - from.y;

    const xStep = xDiff ? (xDiff > 0 ? 1 : -1) : 0;
    const yStep = yDiff ? (yDiff > 0 ? 1 : -1) : 0;

    let x = from.x;
    let y = from.y;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      grid[y][x] = grid[y][x] + 1;

      if (y === to.y && x === to.x) {
        break;
      }
      if (x !== to.x) x += xStep;
      if (y !== to.y) y += yStep;
    }
  });

  const overlaps = grid.flatMap((row) => row).filter((n) => n >= 2);
  const countOfOverlaps = overlaps.length;

  return {
    countOfOverlaps,
  };
}
