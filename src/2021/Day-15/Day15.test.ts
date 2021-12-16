import { createCanvas } from "canvas";
import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";
import * as fs from "fs";

describe("Day 15: Chiton", () => {
  // Drawing the images is kinda slow
  jest.setTimeout(30_000);

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
    expect(await solve(example)).toBe(40);
    expect(await solve(input)).toBe(537);
  });

  test("Part 02 - Five times larger in both dimensions & increased costs!", async () => {
    expect(await solve(example, true)).toBe(315);
    expect(await solve(input, true)).toBe(2881);
  });
});

interface Node {
  key: string;
  x: number;
  y: number;
  localCost: number;
  pathVia?: Node;
  riskCost: number; // "distance" from start aka. tells how much does it costs to get here from start
}

const { floor } = Math;

// Implemented Dijkstra's Algorithm
async function solve(lines: string[], fiveTimesLargerMap = false) {
  let grid = lines.map((l) => l.split("").map((s) => +s));

  const orgWidth = grid[0].length;
  const orgHeight = grid.length;

  let width = grid[0].length;
  let height = grid.length;

  // Part 2 - Enlarge map and update local risks
  if (fiveTimesLargerMap) {
    grid = Array.from({ length: height * 5 }, (_, x) =>
      Array.from({ length: width * 5 }, (_, y) => {
        const orgLocalRisk = grid[y % height][x % width];
        const xRepeat = floor(x / orgWidth);
        const yRepeat = floor(y / orgHeight);
        let localRisk = orgLocalRisk + xRepeat + yRepeat;

        if (localRisk > 9) {
          localRisk -= 9;
        }

        return localRisk;
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
  const targetNode = createNode({ x: targetX, y: targetY });

  nodesMap.set(startNode.key, startNode);
  nodesMap.set(targetNode.key, targetNode);

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
    if (currentNode === targetNode) {
      break;
    }
    if (doneNodes.has(currentNode)) {
      continue;
    }

    const { x, y } = currentNode;

    // Add all direct neighbors to prio list if they are not in it yet
    // If the node is inserted, the via is set to current node
    // Update riskCost if smaller via currentNode
    updateNeighbor(currentNode, x + 1, y); // right
    updateNeighbor(currentNode, x, y + 1); // bottom
    updateNeighbor(currentNode, x, y - 1); // top
    updateNeighbor(currentNode, x - 1, y); // left

    // currentNode is added to done list
    doneNodes.add(currentNode);
  }

  // Draw map at the very end
  await drawMap();

  return targetNode.riskCost;

  function updateNeighbor(fromNode: Node, x: number, y: number) {
    if (x < 0 || x >= width || y < 0 || y > height) return;

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
    return {
      key: getKey(x, y),
      x,
      y,
      riskCost,
      pathVia,
      localCost: grid[y]?.[x] ?? Infinity,
    };
  }

  function getKey(x: number, y: number) {
    return [x, y].join();
  }

  async function drawMap() {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#12f";
    context.fillRect(0, 0, width, height);

    const nodesToDraw = [...nodesMap.values()].filter(
      (n) => n.riskCost < Infinity
    );

    const max = nodesToDraw
      .map((n) => n.riskCost)
      .reduce((a, b) => Math.max(a, b), 0);

    nodesToDraw.forEach((node) => {
      const riskColor = Math.round((node.riskCost / max) * 255)
        .toString(16)
        .padStart(2, "0");
      context.fillStyle = `#${riskColor}196c`;
      context.fillRect(node.x, node.y, 1, 1);
    });

    let backtrackCheapest = targetNode;

    while (backtrackCheapest.pathVia) {
      context.fillStyle = `#ffffff`;
      context.fillRect(backtrackCheapest.x, backtrackCheapest.y, 1, 1);
      backtrackCheapest = backtrackCheapest.pathVia;
    }
    context.fillRect(startNode.x, startNode.y, 1, 1);

    context.font = "bold 70pt Menlo";
    context.font = `bold ${height / 50}pt Menlo`;
    context.textAlign = "right";
    context.textBaseline = "top";

    context.fillStyle = "#fff";
    context.fillText("AoC 2021", width, 0);

    context.fillStyle = "#fff";
    context.fillText("@xiel", width, height / 40);

    const buffer = canvas.toBuffer("image/png");

    return new Promise((resolve) => {
      fs.writeFile(`${__dirname}/${width}x${height}.png`, buffer, resolve);
    });
  }
}
