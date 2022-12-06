import { readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2022/day/6
describe("Day 06", () => {
  test("Example", () => {
    expect(solve("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toEqual(7);
    expect(solve("bvwbjplbgvbhsrlpgdmjqwftvncz")).toEqual(5);
    expect(solve("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14)).toEqual(19);
    expect(solve("bvwbjplbgvbhsrlpgdmjqwftvncz", 14)).toEqual(23);
  });

  test("Part 1 & 2", () => {
    expect(solve(readFileIntoLines(__dirname + "/input.txt")[0])).toEqual(1929);
    expect(solve(readFileIntoLines(__dirname + "/input.txt")[0], 14)).toEqual(
      3298
    );
  });
});

function solve(str: string, size = 4) {
  for (let i = 0; i < str.length; i++) {
    const set = new Set(Array.from(str.substring(i - size + 1, i + 1)));

    if (set.size === size) {
      return i + 1;
    }
  }
}
