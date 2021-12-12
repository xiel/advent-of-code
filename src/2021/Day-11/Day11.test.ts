import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

const miniExample = `
  11111
  19991
  19191
  19991
  11111
`;

const example = `
  5483143223
  2745854711
  5264556173
  6141336146
  6357385478
  4167524645
  2176841721
  6882881134
  4846848554
  5283751526
`;

// https://adventofcode.com/2021/day/11
describe("Day 11: Dumbo Octopus", () => {
  test("01 - Example", () => {
    expect(simulateSteps(readExampleIntoLines(miniExample), 2)).toBe(9);
    expect(simulateSteps(readExampleIntoLines(example), 100)).toBe(1656);
  });

  test("01", () => {
    const lines = readFileIntoLines(`${__dirname}/input.txt`);
    expect(simulateSteps(lines, 100)).toBe(1608);
  });
});

interface Octopus {
  energyLevel: number;
  x: number;
  y: number;
}

function createOctopusState(lines: string[]) {
  const grid = lines.map((line, y) =>
    line
      .split("")
      .map<Octopus>((s, x) => ({ energyLevel: parseInt(s, 10), x, y }))
  );
  return {
    grid,
    w: grid[0].length,
    h: grid.length,
  };
}

function simulateSteps(lines: string[], steps: number) {
  const state = createOctopusState(lines);
  let flashes = 0;

  while (steps--) {
    step();
  }

  return flashes;

  function step() {
    // First, the energy level of each octopus increases by 1.
    incAll();

    // Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent.
    // If this causes an octopus to have an energy level greater than 9, it also flashes. This process continues as long as new octopuses keep having their energy level increased beyond 9.
    // (An octopus can only flash at most once per step.)
    const flashed = flashAllFull();

    flashes += flashed.size;

    // Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
    resetEnergyLevels(flashed);
  }

  function incAll() {
    for (let y = 0; y < state.h; y++) {
      for (let x = 0; x < state.w; x++) {
        state.grid[y][x].energyLevel++;
      }
    }
  }

  function flashAllFull() {
    const flashed = new Set<Octopus>();

    for (let y = 0; y < state.h; y++) {
      for (let x = 0; x < state.w; x++) {
        if (state.grid[y][x].energyLevel >= 10) {
          flash(state.grid[y][x]);
        }
      }
    }

    return flashed;

    function flash(o: Octopus) {
      if (flashed.has(o)) {
        return;
      }
      // ⚡️
      flashed.add(o);

      // Increase energy of octopuses in all directions
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          const oAround = state.grid[o.y + y]?.[o.x + x];

          if (oAround) {
            oAround.energyLevel++;

            if (oAround.energyLevel >= 10) {
              flash(oAround);
            }
          }
        }
      }
    }
  }

  function resetEnergyLevels(flashed: Set<Octopus>) {
    flashed.forEach((o) => (o.energyLevel = 0));
  }
}
