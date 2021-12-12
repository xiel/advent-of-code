import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day 9: Smoke Basin", () => {
  const example = readExampleIntoLines(`
    2199943210
    3987894921
    9856789892
    8767896789
    9899965678
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");
  const resultExample = smokeBasin(example);
  const resultInput = smokeBasin(input);

  test("Part 01 - What is the sum of the risk levels of all low points on your heightmap?", () => {
    expect(resultExample.sum).toBe(15);
    expect(resultInput.sum).toBe(554);
  });

  test("Part 02 - What do you get if you multiply together the sizes of the three largest basins?", () => {
    expect(resultExample.largestBasinsMultiplied).toBe(1134);
    expect(resultInput.largestBasinsMultiplied).toBe(1017792);
  });
});

interface Point {
  x: number;
  y: number;
  localHeight: number;
  isLowPoint: boolean;
}

function smokeBasin(lines: string[]) {
  const heights2d = lines.map((l) => l.split("").map((n) => parseInt(n, 10)));
  const points = heights2d.map((heights, y) =>
    heights.map<Point>((localHeight, x) => {
      const top = heights2d[y - 1]?.[x];
      const right = heights2d[y]?.[x + 1];
      const bottom = heights2d[y + 1]?.[x];
      const left = heights2d[y]?.[x - 1];
      const isLowPoint = [top, right, bottom, left].every(
        (v) => v === undefined || localHeight < v
      );

      return {
        localHeight,
        isLowPoint,
        x,
        y,
      };
    })
  );

  const lowPoints = points
    .flatMap((points) => points)
    .filter((p) => p.isLowPoint);

  const sum = lowPoints.reduce((acc, a) => acc + 1 + a.localHeight, 0);

  const basins = lowPoints.map((lowPoint) => {
    const pointsInBasin = new Set<Point>();

    pointsInBasin.add(lowPoint);
    addAround(lowPoint);

    return {
      size: pointsInBasin.size,
    };

    function addAround(point: Point) {
      const { x, y } = point;
      const top = points[y - 1]?.[x];
      const right = points[y]?.[x + 1];
      const bottom = points[y + 1]?.[x];
      const left = points[y]?.[x - 1];

      [top, right, bottom, left].forEach((nextPoint) => {
        if (!nextPoint) return;
        if (pointsInBasin.has(nextPoint)) return;
        if (nextPoint.localHeight >= 9) return;

        pointsInBasin.add(nextPoint);
        addAround(nextPoint);
      });
    }
  });

  const [a, b, c] = basins.sort((a, b) => b.size - a.size).map((b) => b.size);

  return {
    sum,
    largestBasinsMultiplied: a * b * c,
  };
}
