import { readFileIntoLines } from "../../utils/readFile";
import { product } from "../../utils/math";

// https://adventofcode.com/2022/day/8
describe("Day 08", () => {
  test("Example", () => {
    expect(solve(readFileIntoLines(__dirname + "/example.txt"))).toEqual({
      visibleTrees: 21,
      highestScenicScore: 8,
    });
  });

  test("Part 1 & 2", () => {
    expect(solve(readFileIntoLines(__dirname + "/input.txt"))).toEqual({
      visibleTrees: 1829,
      highestScenicScore: 291840,
    });
  });
});

interface Tree {
  xy: [number, number];
  height: number;
  maxInDir: (dx: number, dy: number) => number;
  freeViewInDir: (dx: number, dy: number, fromHeight: number) => number;
}

const trbl = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function solve(lines: string[]) {
  const map = new Map<string, Tree>(
    lines.flatMap((line, y) =>
      Array.from(line).map((heightStr, x) => {
        const height = +heightStr;
        const tree: Tree = {
          xy: [x, y],
          height,
          maxInDir,
          freeViewInDir,
        };

        return [[x, y].join(), tree];

        function maxInDir(dx: number, dy: number) {
          const adjecentTree = get(x + dx, y + dy);
          if (!adjecentTree) return -1;
          return Math.max(adjecentTree.height, adjecentTree.maxInDir(dx, dy));
        }

        function freeViewInDir(dx: number, dy: number, fromHeight: number) {
          const adjacentTree = get(x + dx, y + dy);

          if (!adjacentTree) return 0;
          if (adjacentTree.height >= fromHeight) {
            return 1;
          }

          return adjacentTree.freeViewInDir(dx, dy, fromHeight) + 1;
        }
      })
    )
  );

  const visibleTrees = Array.from(map.values()).filter((tree) => {
    return trbl.some(([dx, dy]) => {
      return tree.height > tree.maxInDir(dx, dy);
    });
  }).length;

  const highestScenicScore = Math.max(
    ...Array.from(map.values()).map((tree) =>
      trbl
        .map(([dx, dy]) => tree.freeViewInDir(dx, dy, tree.height))
        .reduce(product)
    )
  );

  return {
    visibleTrees,
    highestScenicScore,
  };

  function get(x: number, y: number) {
    return map.get([x, y].join());
  }
}
