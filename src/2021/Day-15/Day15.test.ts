import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day 15: Chiton", () => {
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

  test("Part 01 - What is the lowest total risk of any path from the top left to the bottom right?", async () => {
    expect(solve(example)).toBe(40);
    expect(solve(input)).toBe(537);
  });

  test("Part 02 - Five times larger in both dimensions & increased costs!", () => {
    expect(solve(example, true)).toBe(315);
    expect(solve(input, true)).toBe(2881);
  });
});

interface Node {
  key: string;
  x: number;
  y: number;
  localCost: number;
  pathVia?: Node; // node key
  riskCost: number; // "distance" from start aka. tells how much does it costs to get here from start
}

const { min, max, abs, floor } = Math;

// Implemented Dijkstra's Algorithm
function solve(lines: string[], fiveTimesLargerMap = false) {
  let grid = lines.map((l) => l.split("").map((s) => +s));

  const orgWidth = grid[0].length;
  const orgHeight = grid.length;

  let width = grid[0].length;
  let height = grid.length;

  if (fiveTimesLargerMap) {
    grid = Array.from({ length: height * 5 }, (_, gridY) =>
      Array.from({ length: width * 5 }, (_, gridX) => {
        const orgValue = grid[gridY % height][gridX % width];

        return orgValue;
      })
    );
    width = width * 5;
    height = height * 5;
  }

  const targetX = width - 1;
  const targetY = height - 1;

  const prioList: Node[] = [];
  const nodesMap = new Map<string, Node>();
  const doneNodes = new Set<Node>();

  const startNode = createNode({ x: 0, y: 0, riskCost: 0 });
  nodesMap.set(startNode.key, startNode);
  prioList.push(startNode);

  while (prioList.length) {
    // TODO: find better way instead of sorting again and again, eg. update when inserting/updating nodes
    // instead search for node with lowest (n), no full sort needed
    const currentNode = prioList
      .sort((a, b) => a.riskCost - b.riskCost)
      .shift()!;

    if (currentNode.riskCost === Infinity) {
      break;
    }
    if (doneNodes.has(currentNode)) {
      continue;
    }

    const { x, y } = currentNode;

    // Add all direct neighbors to prio list if they are not in it yet
    // If the node is inserted, the via is set to current node
    // riskCost is updated if smaller
    updateNeighbor(currentNode, x + 1, y); // right
    updateNeighbor(currentNode, x, y + 1); // bottom
    updateNeighbor(currentNode, x, y - 1); // top
    updateNeighbor(currentNode, x - 1, y); // left

    // currentNode is added to done list
    doneNodes.add(currentNode);
  }

  const targetNode = nodesMap.get(getKey(targetX, targetY))!;

  const localCostsToTarget: number[] = [];
  let backTrackingNode = targetNode;

  while (backTrackingNode.pathVia) {
    localCostsToTarget.push(backTrackingNode.localCost);
    backTrackingNode = backTrackingNode.pathVia;
  }

  console.log(`targetNode`, targetNode);
  console.log(`localCostsToTarget`, localCostsToTarget);

  return targetNode.riskCost;

  function updateNeighbor(fromNode: Node, x: number, y: number) {
    const neighborKey = getKey(x, y);
    let neighborNode = nodesMap.get(neighborKey);

    if (!neighborNode) {
      neighborNode = createNode({
        x,
        y,
      });
      nodesMap.set(neighborKey, neighborNode);
      prioList.push(neighborNode);
    }

    const possibleRiskCost = fromNode.riskCost + neighborNode.localCost;

    if (possibleRiskCost < neighborNode.riskCost) {
      neighborNode.pathVia = fromNode;
      neighborNode.riskCost = possibleRiskCost;
    }
  }

  function createNode({
    x,
    y,
    pathVia,
    riskCost = Infinity,
  }: Omit<Node, "key" | "localCost" | "riskCost"> & {
    riskCost?: number;
  }): Node {
    const xRepeat = floor(x / orgWidth);
    const yRepeat = floor(y / orgHeight);
    let localCost = (grid[y]?.[x] ?? Infinity) + xRepeat + yRepeat;

    if (localCost > 9) {
      localCost -= 9;
    }

    return {
      key: getKey(x, y),
      x,
      y,
      riskCost,
      pathVia,
      localCost,
    };
  }

  function getKey(x: number, y: number) {
    return [x, y].join();
  }
}

function solveFreeStyle(lines: string[]) {
  interface Path {
    x: number;
    y: number;
    entered: number[];
    risk: number;
    hadBeenAt: Set<string>;
    distance: number;
  }
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
      const newPaths = [
        pathEnters(path, x + 1, y), // right
        pathEnters(path, x, y + 1), // bottom
        pathEnters(path, x, y - 1), // top
        pathEnters(path, x - 1, y), // left
      ].filter((path) => {
        return path.risk < bestRiskInFinished;
      });

      if (!newPaths.length) {
        return [];
      }

      const [best, ...rest] = newPaths.sort((a, b) => a.risk - b.risk);

      pausedPaths.push(...rest);

      return [best];
    });

    const activeDistances = activePaths.map((p) => p.distance);
    const averageDistance = Math.ceil(
      activeDistances.reduce((a, b) => a + b, 0) / activeDistances.length
    );

    const PATH_ALIVE = 10; // width, 100 ? !finishedPaths.length ? 5 : 10

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
      if (path.risk >= bestRiskInFinished) {
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

    if (i % 10000 === 0) {
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
