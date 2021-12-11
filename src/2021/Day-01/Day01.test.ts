import { readFileIntoLines } from "../../utils/readFile";

describe("Day 1: Sonar Sweep", () => {
  test("01", () => {
    const depths = readFileIntoLines(__dirname + "/input.txt");

    let prev: number | undefined = undefined;
    let increases = 0;
    for (const depth of depths) {
      const current = parseInt(depth);

      if (prev !== undefined && current > prev) {
        increases++;
      }
      prev = current;
    }

    expect(increases).toBe(1713);
  });

  test("02", () => {
    const depthsNums = readFileIntoLines(__dirname + "/input.txt").map((d) =>
      parseInt(d, 10)
    );
    let increases = 0;
    let sumPrev: number | undefined = undefined;

    for (let i = 0; i < depthsNums.length; i++) {
      const sumCurrent = depthsNums[i] + depthsNums[i + 1] + depthsNums[i + 2];

      if (isNaN(sumCurrent)) break;
      if (sumPrev !== undefined && sumCurrent > sumPrev) {
        increases++;
      }

      sumPrev = sumCurrent;
    }

    expect(increases).toBe(1734);
  });
});
