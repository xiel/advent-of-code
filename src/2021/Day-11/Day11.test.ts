import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/11
describe("Day 11: Dumbo Octopus", () => {
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

  test("01 - How many total flashes are there after 100 steps?", () => {
    expect(runSteps(readExampleIntoLines(miniExample), 2).flashes).toBe(9);
    expect(runSteps(readExampleIntoLines(example), 100).flashes).toBe(1656);
    expect(
      runSteps(readFileIntoLines(`${__dirname}/input.txt`), 100).flashes
    ).toBe(1608);
  });

  test("02 - What is the first step during which all octopuses flash?", () => {
    expect(runSteps(readExampleIntoLines(example)).synchronizedAtStep).toBe(
      195
    );
    expect(
      runSteps(readFileIntoLines(`${__dirname}/input.txt`)).synchronizedAtStep
    ).toBe(214);
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

function runSteps(lines: string[], stepsMax = Infinity) {
  const { grid, w, h } = createOctopusState(lines);

  let stepCount = 0;
  let flashes = 0;
  let synchronizedAtStep = -1;

  while (stepCount < stepsMax && synchronizedAtStep === -1) {
    stepCount++;
    step();
  }

  return {
    flashes,
    synchronizedAtStep,
  };

  function step() {
    // First, the energy level of each octopus increases by 1.
    incAll();

    const flashed = flashAllFull();

    // Detect if all octopuses flashed at the same time
    if (flashed.size === w * h) {
      synchronizedAtStep = stepCount;
    }

    flashes += flashed.size;

    // Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
    resetEnergyLevels(flashed);
  }

  function incAll() {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        grid[y][x].energyLevel++;
      }
    }
  }

  function flashAllFull() {
    const flashed = new Set<Octopus>();

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (grid[y][x].energyLevel >= 10) {
          flash(grid[y][x], flashed);
        }
      }
    }

    return flashed;
  }

  function flash(o: Octopus, flashed: Set<Octopus>) {
    if (flashed.has(o)) {
      return;
    }

    // ⚡️
    flashed.add(o);

    // Increase energy of octopuses in all directions
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const oAround = grid[o.y + y]?.[o.x + x];

        if (oAround) {
          oAround.energyLevel++;

          if (oAround.energyLevel >= 10) {
            flash(oAround, flashed);
          }
        }
      }
    }
  }

  function resetEnergyLevels(flashed: Set<Octopus>) {
    flashed.forEach((o) => (o.energyLevel = 0));
  }
}
