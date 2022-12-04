import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

const example = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

// https://adventofcode.com/2022/day/4
describe("Day 04", () => {
  test("Example", () => {
    expect(part1(readExampleIntoLines(example))).toEqual({
      fullContainments: 2,
      overlaps: 4,
    });
  });

  test("Part 1", () => {
    expect(
      part1(readFileIntoLines(__dirname + "/input.txt")).fullContainments
    ).toEqual(441);
  });

  test("Part 2", () => {
    expect(part1(readFileIntoLines(__dirname + "/input.txt")).overlaps).toEqual(
      861
    );
  });
});

function part1(str: string[]) {
  const sectionPairs = str.map((s) =>
    s
      .split(",")
      .map((s) => s.split("-").map((n) => parseInt(n)) as [number, number])
  );

  let fullContainments = 0;
  let overlaps = 0;

  for (const [secA, secB] of sectionPairs) {
    const contains = fullyContains(secA, secB) || fullyContains(secB, secA);

    if (contains) {
      fullContainments++;
      overlaps++;
    } else if (doOverlap(secA, secB)) {
      overlaps++;
    }
  }

  return { fullContainments, overlaps };

  function fullyContains(
    [aStart, aEnd]: [number, number],
    [bStart, bEnd]: [number, number]
  ) {
    return bStart >= aStart && bEnd <= aEnd;
  }

  function doOverlap(
    [aStart, aEnd]: [number, number],
    [bStart, bEnd]: [number, number]
  ) {
    return (
      (bEnd >= aStart && bStart < aStart) || (bStart <= aEnd && bEnd > aEnd)
    );
  }
}
