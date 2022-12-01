import { readFileIntoGroups } from "../../utils/readFile";
import { desc, sum } from "../../utils/math";

// https://adventofcode.com/2022/day/1
describe("Day 01", () => {
  test("Part 1", () => {
    const calories = readFileIntoGroups(__dirname + "/input.txt").map((group) =>
      group
        .split("\n")
        .filter(Boolean)
        .map((n) => parseInt(n))
        .reduce(sum)
    );

    expect(Math.max(...calories)).toMatchInlineSnapshot(`71023`);
  });

  test("Part 2", () => {
    const top3Sum = readFileIntoGroups(__dirname + "/input.txt")
      .map((group) =>
        group
          .split("\n")
          .filter(Boolean)
          .map((n) => parseInt(n))
          .reduce(sum)
      )
      .sort(desc)
      .slice(0, 3)
      .reduce(sum);

    expect(top3Sum).toMatchInlineSnapshot(`206289`);
  });
});
