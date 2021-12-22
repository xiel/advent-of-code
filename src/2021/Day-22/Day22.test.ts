import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/22
describe("Day 22: Reactor Reboot", () => {
  const example = readFileIntoLines(__dirname + "/example.txt");
  const exampleBig = readFileIntoLines(__dirname + "/exampleBig.txt");
  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - ...", () => {
    expect(
      solve(
        readExampleIntoLines(`
          on x=10..12,y=10..12,z=10..12
          on x=11..13,y=11..13,z=11..13
          off x=9..11,y=9..11,z=9..11
          on x=10..10,y=10..10,z=10..10
    `)
      ).cellsOnAfterSteps
    ).toBe(39);
    expect(solve(example).cellsOnAfterSteps).toBe(590784);
    expect(solve(input).cellsOnAfterSteps).toBe(648681);
  });

  test("Part 02 - ..", () => {
    expect(solve2(example).cellsOnAfterSteps).toBe(2758514936282235);
    expect(solve2(input).cellsOnAfterSteps).toBe(-1);
  });
});

const { min, max, abs, floor, ceil, round } = Math;
const _ = (...args: unknown[]) => args.join();

function getSteps(lines: string[]) {
  return lines.map((l) => {
    const [turn] = l.split(" ");
    const matches = [...l.matchAll(/-?\d+/g)].map((n) => +n[0]);
    const [fromX, toX, fromY, toY, fromZ, toZ] = matches;
    return {
      turn,
      fromX,
      toX,
      fromY,
      toY,
      fromZ,
      toZ,
    };
  });
}

function solve(lines: string[]) {
  const map = new Map<string, number>();
  const steps = getSteps(lines);

  // TODO: can i do the map virstual somehow? execute the steps on read for a cell?
  // start from last step and find the latest step that sets the value
  for (const step of steps) {
    let { fromX, fromY, fromZ, toX, toY, toZ } = step;
    fromX = max(fromX, -50);
    fromY = max(fromY, -50);
    fromZ = max(fromZ, -50);
    toX = min(toX, 50);
    toY = min(toY, 50);
    toZ = min(toZ, 50);
    for (let x = fromX; x <= toX; x++) {
      for (let y = fromY; y <= toY; y++) {
        for (let z = fromZ; z <= toZ; z++) {
          if (x < -50 || x > 50 || y < -50 || y > 50 || y < -50 || y > 50)
            continue;
          const key = _(x, y, z);
          const state = map.get(key);

          if (step.turn === "on") {
            map.set(key, 1);
          } else if (state) {
            map.delete(key);
          }
        }
      }
    }
  }

  return {
    get cellsOnAfterSteps() {
      return [...map.values()].reduce((a, b) => a + b, 0);
    },
  };
}

function solve2() {
  return {
    cellsOnAfterSteps: 1,
  };
}
