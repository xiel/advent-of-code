import { readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2022/day/6
describe("Day 06", () => {
  test("Example", () => {
    expect(part1("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toEqual(7);
    expect(part1("bvwbjplbgvbhsrlpgdmjqwftvncz")).toEqual(5);
    expect(part2("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toEqual(19);
    expect(part2("bvwbjplbgvbhsrlpgdmjqwftvncz")).toEqual(23);
  });

  test("Part 1 & 2", () => {
    expect(part1(readFileIntoLines(__dirname + "/input.txt")[0])).toEqual(1929);
    expect(part2(readFileIntoLines(__dirname + "/input.txt")[0])).toEqual(3298);
  });
});

function part1(str: string) {
  for (let i = 0; i < str.length; i++) {
    const set = new Set(
      [i, i - 1, i - 2, i - 3].map((j) => str[j]).filter(Boolean)
    );
    if (set.size === 4) {
      return i + 1;
    }
  }
}
function part2(str: string) {
  for (let i = 0; i < str.length; i++) {
    const set = new Set(
      Array.from({ length: 14 }, (_, j) => i - j)
        .map((j) => str[j])
        .filter(Boolean)
    );
    if (set.size === 14) {
      return i + 1;
    }
  }
}
