import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day 25: Sea Cucumber", () => {
  const example = readExampleIntoLines(`
    v...>>.vv>
    .vv>>.vv..
    >>.>v>...v
    >>v>>.>.v.
    v>v.vv.v..
    >.>>..v...
    .vv..>.>v.
    v.v..>>v.v
    ....v..v.>
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 1 & 2 - What is the first step on which no sea cucumbers move?", () => {
    expect(solve(example)).toBe(58);
    expect(solve(input)).toBe(528);
  });
});

function solve(lines: string[]) {
  const width = lines[0].length;
  const height = lines.length;
  let map = new Map<string, string>(
    lines.flatMap((l, y) => l.split("").map((v, x) => [_(x, y), v]))
  );

  let step = 0;

  while (map) {
    step++;

    const east = move(">");
    map = east.newMap;

    const south = move("v");
    map = south.newMap;

    if (!east.didMove && !south.didMove) {
      break;
    }
  }

  print();

  return step;

  function move(moving: string) {
    const newMap = new Map<string, string>(map);
    let didMove = false;

    map.forEach((value, key) => {
      if (value === ".") return;
      const [x, y] = key.split(",").map((n) => +n);

      if (value === "v" && moving === "v") {
        const nextSpot = get(x, y + 1);
        if (nextSpot === ".") {
          newMap.set(key, ".");
          newMap.set(_(x, (y + 1) % height), value);
          didMove = true;
        }
      }

      if (value === ">" && moving === ">") {
        const nextSpot = get(x + 1, y);
        if (nextSpot === ".") {
          newMap.set(key, ".");
          newMap.set(_((x + 1) % width, y), value);
          didMove = true;
        }
      }
    });

    return { newMap, didMove };
  }

  function print() {
    const printable = Array.from({ length: height }, () =>
      Array.from({ length: width })
    );
    [...map.entries()].forEach(([key, value]) => {
      const [x, y] = key.split(",").map((n) => +n);
      printable[y][x] = value;
    });
    console.log(printable.map((l) => l.join("")));
  }

  function get(x: number, y: number) {
    return map.get(_(x % width, y % height))!;
  }

  function _(...args: unknown[]) {
    return args.join();
  }
}
