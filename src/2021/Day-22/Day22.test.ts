import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/22
describe("Day 22: Reactor Reboot", () => {
  const example = readExampleIntoLines(`
    on x=-20..26,y=-36..17,z=-47..7
    on x=-20..33,y=-21..23,z=-26..28
    on x=-22..28,y=-29..23,z=-38..16
    on x=-46..7,y=-6..46,z=-50..-1
    on x=-49..1,y=-3..46,z=-24..28
    on x=2..47,y=-22..22,z=-23..27
    on x=-27..23,y=-28..26,z=-21..29
    on x=-39..5,y=-6..47,z=-3..44
    on x=-30..21,y=-8..43,z=-13..34
    on x=-22..26,y=-27..20,z=-29..19
    off x=-48..-32,y=26..41,z=-47..-37
    on x=-12..35,y=6..50,z=-50..-2
    off x=-48..-32,y=-32..-16,z=-15..-5
    on x=-18..26,y=-33..15,z=-7..46
    off x=-40..-22,y=-38..-28,z=23..41
    on x=-16..35,y=-41..10,z=-47..6
    off x=-32..-23,y=11..30,z=-14..3
    on x=-49..-5,y=-3..45,z=-29..18
    off x=18..30,y=-20..-8,z=-3..13
    on x=-41..9,y=-7..43,z=-33..15
    on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
    on x=967..23432,y=45373..81175,z=27513..53682
  `);

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
    // ...
  });
});

const { min, max, abs, floor, ceil, round } = Math;
type XYZ = [number, number, number];
const _ = (...args: unknown[]) => args.join();

function solve(lines: string[]) {
  const map = new Map<string, number>();
  const steps = lines.map((l) => {
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
