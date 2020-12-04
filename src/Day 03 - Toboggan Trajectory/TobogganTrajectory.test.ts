import { countTreeEncounters } from "./countTreeEncounters";
import { inputTreeMap } from "./input";

const exampleMap = [
  "..##.......",
  "#...#...#..",
  ".#....#..#.",
  "..#.#...#.#",
  ".#...##..#.",
  "..#.##.....",
  ".#.#.#....#",
  ".#........#",
  "#.##...#...",
  "#...##....#",
  ".#..#...#.#",
];

describe("Toboggan Trajectory", () => {
  it("should work on provided example", async () => {
    expect(
      countTreeEncounters(exampleMap, {
        right: 3,
        down: 1,
      })
    ).toBe(7);
  });

  it("should produce answer for given input", function () {
    expect(
      countTreeEncounters(inputTreeMap, {
        right: 3,
        down: 1,
      })
    ).toMatchInlineSnapshot(`230`);
  });
});
