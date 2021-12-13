import {
  readExampleIntoGroups,
  readFileIntoGroups,
} from "../../utils/readFile";

describe("Day 13: Transparent Origami", () => {
  const example = readExampleIntoGroups(`
    6,10
    0,14
    9,10
    0,3
    10,4
    4,11
    6,0
    6,12
    4,1
    0,13
    10,12
    3,4
    3,0
    8,4
    1,10
    2,14
    8,10
    9,0
    
    fold along y=7
    fold along x=5
  `);
  const resultExample = transparentOrigami(example);
  const input = readFileIntoGroups(__dirname + "/input.txt");
  const resultInput = transparentOrigami(input);

  test("Part 01 - How many dots are visible after completing just the first fold instruction on your transparent paper?", () => {
    expect(resultExample.visibleDots[0]).toBe(17);
    expect(resultInput.visibleDots[0]).toBe(716);
  });

  test("Part 02 - What code do you use to activate the infrared thermal imaging camera system?", () => {
    expect(resultExample.finalResult).toMatchInlineSnapshot(`
      "#####
      #...#
      #...#
      #...#
      #####
      .....
      ....."
    `);
    expect(resultInput.finalResult).toMatchInlineSnapshot(`
      "###..###...##..#..#.####.###..#....###..
      #..#.#..#.#..#.#.#..#....#..#.#....#..#.
      #..#.#..#.#....##...###..###..#....#..#.
      ###..###..#....#.#..#....#..#.#....###..
      #.#..#....#..#.#.#..#....#..#.#....#.#..
      #..#.#.....##..#..#.#....###..####.#..#."
    `);
  });
});

type XY = "x" | "y";
type Coord = { x: number; y: number };

function transparentOrigami(lines: string[]) {
  const [coordsStr, foldsStr] = lines;

  let dotsCoords = coordsStr.split("\n").map<Coord>((s) => {
    const [x, y] = s.split(",").map((s) => parseInt(s, 10));
    return { x, y };
  });

  const folds = foldsStr
    .trim()
    .split("\n")
    .map((s) => {
      const value = parseInt(s.split("=")[1], 10);
      const foldAt = s.includes("x=") ? "x" : ("y" as const);
      return [foldAt, value] as [XY, number];
    });

  let width = Math.max(...dotsCoords.map((c) => c.x)) + 1;
  let height = Math.max(...dotsCoords.map((c) => c.y)) + 1;

  // Create 2d array width * height dimensions; 0 = . (nothing); 1 = # (dot)
  let paperGrid: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );

  dotsCoords.forEach((dot) => {
    paperGrid[dot.y][dot.x] = 1;
  });

  const visibleDots: number[] = [];

  for (const fold of folds) {
    foldPaper(fold);
    visibleDots.push(paperGrid.flatMap((c) => c).reduce((a, b) => a + b));
  }

  const finalResult = getGridAsString();
  console.log(finalResult);

  return {
    visibleDots,
    finalResult,
  };

  function foldPaper(foldAt: [XY, number]) {
    const [foldAtAxis, foldAtValue] = foldAt;
    const newWidth = foldAtAxis === "x" ? foldAtValue : width;
    const newHeight = foldAtAxis === "y" ? foldAtValue : height;
    const newCoords = dotsCoords.map<Coord>((coord) => {
      const { x, y } = coord;
      if (foldAtAxis === "x") {
        const diffToFold = x - foldAtValue;
        if (diffToFold <= 0) return coord;
        return {
          x: newWidth - diffToFold,
          y,
        };
      } else {
        const diffToFold = y - foldAtValue;
        if (diffToFold <= 0) return coord;
        return {
          x,
          y: newHeight - diffToFold,
        };
      }
    });

    const newPaperGrid: number[][] = Array.from({ length: newHeight }, () =>
      Array.from({ length: newWidth }, () => 0)
    );

    newCoords.forEach((dot) => {
      newPaperGrid[dot.y][dot.x] = 1;
    });

    dotsCoords = newCoords;
    paperGrid = newPaperGrid;
    width = newWidth;
    height = newHeight;
  }

  function getGridAsString() {
    return paperGrid
      .map((row) => row.map((n) => (n > 0 ? "#" : ".")).join(""))
      .join("\n");
  }
}
