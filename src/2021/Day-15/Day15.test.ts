import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day XX", () => {
  const example = readExampleIntoLines(`
    1163751742
    1381373672
    2136511328
    3694931569
    7463417111
    1319128137
    1359912421
    3125421639
    1293138521
    2311944581
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - ...", async () => {
    expect(solve(example)).toBe(40);

    console.log("INPUT");

    // const maxRisk = solve(input);
    // expect(maxRisk).toBeLessThan(538);
    // expect(maxRisk).toBeGreaterThan(530);
    // expect(maxRisk).toBe(-1);
  });

  test("Part 02 - ..", () => {
    // ...
  });
});

const { min, max, abs } = Math;

async function solveAgain2(lines: string[]) {
  const grid = lines.map((l) => l.split("").map((s) => +s));

  const width = grid[0].length;
  const height = grid.length;

  console.log(`grid`, grid);

  const targetX = width - 1;
  const targetY = height - 1;

  const mem = new Map<string, number>();

  return (await resolve(0, 0)) - grid[0][0];

  async function resolve(x: number, y: number): Promise<number> {
    const xyKey = `${x},${y}`;
    if (mem.has(xyKey)) {
      return mem.get(xyKey)!;
    }
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return Infinity;
    }
    if (x == targetX && y == targetY) {
      return grid[y][x];
    }

    const result: number =
      grid[y][x] +
      min(
        await resolve(x, y + 1),
        await resolve(x + 1, y)
        // await resolve(x - 1, y),
        // await resolve(x, y - 1)
      );

    mem.set(xyKey, result);

    return result;
  }
}

function solveAgain(lines: string[]) {
  const grid = lines.map((l) => l.split("").map((s) => +s));

  const riskGrid = lines.map((l) =>
    l
      .split("")
      .map((s) => +s)
      .fill(Infinity)
  );

  const width = grid[0].length;
  const height = grid.length;

  const targetX = width - 1;
  const targetY = height - 1;

  for (let y = targetY; y >= 0; y--) {
    for (let x = targetX; x >= 0; x--) {
      const ownRisk = grid[y][x];
      const rightRisk = riskGrid[y]?.[x + 1];
      const bottomRisk = riskGrid[y + 1]?.[x];

      // target pos
      if (rightRisk === undefined && bottomRisk === undefined) {
        riskGrid[y][x] = ownRisk;
      } else if (bottomRisk === undefined) {
        riskGrid[y][x] = ownRisk + rightRisk;
      } else if (rightRisk === undefined) {
        riskGrid[y][x] = ownRisk + bottomRisk;
      } else {
        riskGrid[y][x] = ownRisk + Math.min(rightRisk, bottomRisk);
      }
    }
  }

  console.log(`riskGrid`, riskGrid);

  return riskGrid[0][0] - 1;
}

interface Path {
  x: number;
  y: number;
  entered: number[];
  risk: number;
  hadBeenAt: Set<string>;
  distance: number;
}

function solve(lines: string[]) {
  const grid = lines.map((l) => l.split("").map((s) => +s));

  const width = grid[0].length;
  const height = grid.length;

  const targetX = width - 1;
  const targetY = height - 1;

  let i = 0;

  let activePaths: Path[] = [createPath()];
  let pausedPaths: Path[] = [];

  const finishedPaths: Path[] = [];

  // sum of sides
  const sidesSum =
    grid[0].reduce((a, b) => a + b, 0) +
    grid.map((l) => l[0]).reduce((a, b) => a + b, 0);

  let bestRiskInFinished = sidesSum;

  while (activePaths.length || pausedPaths.length) {
    i++;

    activePaths = activePaths.flatMap((path) => {
      const { x, y } = path;
      return [
        pathEnters(path, x + 1, y), // right
        pathEnters(path, x, y + 1), // bottom
        pathEnters(path, x, y - 1), // top
        pathEnters(path, x - 1, y), // left
      ];
    });

    const activeDistances = activePaths.map((p) => p.distance);
    const averageDistance = Math.ceil(
      activeDistances.reduce((a, b) => a + b, 0) / activeDistances.length
    );

    const PATH_ALIVE = finishedPaths.length ? 6 : 2; // width, 100 ? !finishedPaths.length ? 5 : 10

    // correct example sequence:
    // [1] 1 2 1  3 6 5  1 1 1  5  1 1  3 2  3 2  1 1
    activePaths = activePaths.filter((path) => {
      // Remove all finished paths
      if (isAtFinish(path)) {
        if (path.risk < bestRiskInFinished) {
          console.log("new best!", path.risk, {
            i,
            fin: finishedPaths.length,
            a: activePaths.length,
            paused: pausedPaths.length,
          });
          bestRiskInFinished = path.risk;
        }

        finishedPaths.push(path);
        return false;
      }

      // This path must not be considered anymore
      if (path.risk > bestRiskInFinished) {
        return false;
      }

      // This path is paused for now as it is more far away from target
      if (path.distance > averageDistance) {
        pausedPaths.push(path);
        return false;
      }

      return true;
    });

    if (activePaths.length > PATH_ALIVE) {
      pausedPaths = pausedPaths.concat(activePaths.slice(PATH_ALIVE));
      activePaths = activePaths.slice(0, PATH_ALIVE);
    }

    if (activePaths.length === 0 && pausedPaths.length) {
      const reactivatedPaths = pausedPaths.slice(0, PATH_ALIVE);
      pausedPaths = pausedPaths.slice(PATH_ALIVE);
      activePaths = activePaths.concat(reactivatedPaths);
    }

    if (i % 1000 === 0) {
      console.log({
        i,
        width,
        fin: finishedPaths.length,
        a: activePaths.length,
        paused: pausedPaths.length,
        bestRiskInFinished,
      });
    }
  }

  console.log({
    i,
    width,
    fin: finishedPaths.length,
    a: activePaths.length,
    paused: pausedPaths.length,
    bestRiskInFinished,
  });

  console.log("END", { i }, { f: finishedPaths.length });

  return bestRiskInFinished;

  function createPath({
    entered = [],
    x = 0,
    y = 0,
    hadBeenAt,
  }: Partial<Path> = {}): Path {
    const enteredImmutable = Object.freeze([...entered]) as number[];
    const risk = enteredImmutable.reduce((a, b) => a + b, 0);
    const posStr = [x, y].join();
    const beenAt = new Set([...(hadBeenAt || []), posStr]);
    const distance = Math.abs(targetX - x) + Math.abs(targetY - y);

    return {
      x,
      y,
      risk,
      hadBeenAt: beenAt,
      entered: enteredImmutable,
      distance,
    };
  }

  function pathEnters(path: Path, x: number, y: number): Path {
    let enteredRisk = grid[y]?.[x] ?? Infinity;

    if (path.hadBeenAt.has([x, y].join())) {
      enteredRisk = Infinity;
    }

    return createPath({
      x,
      y,
      entered: path.entered.concat(enteredRisk),
      hadBeenAt: path.hadBeenAt,
    });
  }

  function isAtFinish(path: Path) {
    const yep = path.x === targetX && path.y === targetY;

    if (yep) {
      // console.log("finished", path.x, path.y, path.risk);
    }

    return yep;
  }
}
