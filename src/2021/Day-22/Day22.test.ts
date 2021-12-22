import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/22
describe("Day 22: Reactor Reboot", () => {
  const example = readFileIntoLines(__dirname + "/example.txt");
  const exampleBig = readFileIntoLines(__dirname + "/exampleBig.txt");
  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - How many cubes are on (in limited area)?", () => {
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

  test("Part 02 - How many cubes are on after all steps?", () => {
    expect(solve2(exampleBig).cellsOnAfterSteps).toBe(2758514936282235);
    expect(solve2(input).cellsOnAfterSteps).toBe(1302784472088899);
  });
});

const { min, max } = Math;
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

interface Box {
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
  fromZ: number;
  toZ: number;
}

function solve2(lines: string[]) {
  const steps = getSteps(lines);
  const boxes: Box[] = [];

  let onVolume = 0;

  steps.reverse().forEach(({ turn, ...box }) => {
    if (turn === "on") {
      onVolume += volume(box) - overlap(box, boxes);
    }
    boxes.push(box);
  });

  return {
    cellsOnAfterSteps: onVolume,
  };

  function lineOverlap(min0: number, max0: number, min1: number, max1: number) {
    return [Math.max(min0, min1), Math.min(max0, max1)];
  }

  function volume(box: Box) {
    return (
      (box.toX - box.fromX + 1) *
      (box.toY - box.fromY + 1) *
      (box.toZ - box.fromZ + 1)
    );
  }

  function overlap(box: Box, boxes: Box[]): number {
    return boxes
      .map((prevBox) => {
        const [overlapMinX, overlapMaxX] = lineOverlap(
          box.fromX,
          box.toX,
          prevBox.fromX,
          prevBox.toX
        );
        const [overlapMinY, overlapMaxY] = lineOverlap(
          box.fromY,
          box.toY,
          prevBox.fromY,
          prevBox.toY
        );
        const [overlapMinZ, overlapMaxZ] = lineOverlap(
          box.fromZ,
          box.toZ,
          prevBox.fromZ,
          prevBox.toZ
        );
        if (
          overlapMaxX - overlapMinX >= 0 &&
          overlapMaxY - overlapMinY >= 0 &&
          overlapMaxZ - overlapMinZ >= 0
        ) {
          const tempBox: Box = {
            fromX: overlapMinX,
            toX: overlapMaxX,
            fromY: overlapMinY,
            toY: overlapMaxY,
            fromZ: overlapMinZ,
            toZ: overlapMaxZ,
          };

          return (
            volume(tempBox) -
            overlap(tempBox, boxes.slice(1 + boxes.indexOf(prevBox)))
          );
        } else {
          return 0;
        }
      })
      .reduce((a, b) => a + b, 0);
  }
}
