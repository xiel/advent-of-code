import { readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2022/day/9
describe("Day 09", () => {
  test("Example Head & Tail", () => {
    expect(solve(readFileIntoLines(__dirname + "/example.txt"))).toEqual({
      visited: 13,
    });
  });
  test("Example - Head & 9 Knots", () => {
    expect(solve(readFileIntoLines(__dirname + "/example.txt"), 9)).toEqual({
      visited: 1,
    });
  });
  test("Example - Head & 9 Knots - larger map", () => {
    expect(
      solve(readFileIntoLines(__dirname + "/largerExample.txt"), 9)
    ).toEqual({
      visited: 36,
    });
  });

  test("Part 1", () => {
    expect(solve(readFileIntoLines(__dirname + "/input.txt"))).toEqual({
      visited: 6464,
    });
  });
  test("Part 2", () => {
    expect(solve(readFileIntoLines(__dirname + "/input.txt"), 9)).toEqual({
      visited: 2604,
    });
  });
});

const directions = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

function solve(moves: string[], numberOfKnots = 1) {
  const visited = new Set<string>();

  let headPosition = [0, 0];
  const knotsPositions = Array.from({ length: numberOfKnots }, () => [0, 0]);

  visited.add(`${[0, 0]}`);

  for (const move of moves) {
    const [dir, length] = move.split(" ") as [keyof typeof directions, string];
    const [dx, dy] = directions[dir];
    let len = +length;

    while (len--) {
      headPosition = [headPosition[0] + dx, headPosition[1] + dy];

      for (const [i, knotPosition] of knotsPositions.entries()) {
        const leadingKnot = knotsPositions[i - 1] || headPosition;

        const diffToLead = [
          leadingKnot[0] - knotPosition[0],
          leadingKnot[1] - knotPosition[1],
        ];

        if (Math.abs(diffToLead[0]) > 1 || Math.abs(diffToLead[1]) > 1) {
          knotsPositions[i] = [
            knotPosition[0] + Math.sign(diffToLead[0]),
            knotPosition[1] + Math.sign(diffToLead[1]),
          ];
        }
      }

      const tailPosition = knotsPositions[knotsPositions.length - 1];
      visited.add(`${tailPosition}`);
    }
  }

  logMap();

  return {
    visited: visited.size,
  };

  function logMap() {
    const positions = [headPosition, ...knotsPositions];
    const minX = Math.min(...positions.map((p) => p[0]));
    const maxX = Math.max(...positions.map((p) => p[0]));
    const minY = Math.min(...positions.map((p) => p[1]));
    const maxY = Math.max(...positions.map((p) => p[1]));
    const width = Math.max(6, maxX - minX + 1);
    const height = Math.max(6, maxY - minY + 1);
    const map = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ".")
    );
    for (const [i, [x, y]] of positions.entries()) {
      if (map[y - minY][x - minX] === ".") {
        map[y - minY][x - minX] = `${i === 0 ? "H" : i}`;
      }
    }
    map.reverse();
    console.log(map.map((row) => row.join("")).join("\n"));
  }
}
