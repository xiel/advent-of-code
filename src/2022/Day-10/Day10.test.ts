import { readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2022/day/10
describe("Day 10", () => {
  test("Example ", () => {
    const result = solve(readFileIntoLines(__dirname + "/example.txt"));
    expect(result.signalSum).toEqual(13140);
  });

  test("Part 1 &  2", () => {
    const result = solve(readFileIntoLines(__dirname + "/input.txt"));
    expect(result.signalSum).toEqual(13520);
    expect(result.letters).toMatchInlineSnapshot(`
      "###...##..###..#..#.###..####..##..###..
      #..#.#..#.#..#.#..#.#..#.#....#..#.#..#.
      #..#.#....#..#.####.###..###..#..#.###..
      ###..#.##.###..#..#.#..#.#....####.#..#.
      #....#..#.#....#..#.#..#.#....#..#.#..#.
      #.....###.#....#..#.###..####.#..#.###.."
    `);
  });
});

function solve(lines: string[]) {
  let x = 1;
  let cycle = 0;
  let signalSum = 0;
  const screen = Array.from({ length: 6 }, () =>
    Array.from({ length: 40 }, () => ".")
  );

  for (const line of lines) {
    const [inst, valStr] = line.split(" ");
    const val = +valStr;
    let instCycles = inst === "addx" ? 2 : 1;

    while (instCycles--) {
      const yPos = Math.floor(cycle / 40);
      const xPos = cycle % 40;

      cycle++;

      if (x >= xPos - 1 && x <= xPos + 1) {
        screen[yPos][xPos] = "#";
      }

      if ((cycle - 20) % 40 === 0) {
        signalSum += x * cycle;
      }

      // ... cycle
      if (instCycles === 0 && inst === "addx") {
        x += val;
      }
    }
  }

  return {
    signalSum,
    letters: screen.map((l) => l.join("")).join("\n"),
  };
}
