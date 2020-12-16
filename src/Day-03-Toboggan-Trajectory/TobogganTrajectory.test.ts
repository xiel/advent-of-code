import {
  calcProductOfTreeEncountersForSlopesOnMap,
  countTreeEncounters,
} from "./countTreeEncounters";
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
  it("should count trees on map with slope (example)", async () => {
    expect(
      countTreeEncounters(exampleMap, {
        right: 3,
        down: 1,
      })
    ).toBe(7);
  });

  it("should multiply together the number of trees encountered on each of the listed slopes (example)", () => {
    expect(
      calcProductOfTreeEncountersForSlopesOnMap(
        [
          { right: 1, down: 1 },
          { right: 3, down: 1 },
          { right: 5, down: 1 },
          { right: 7, down: 1 },
          { right: 1, down: 2 },
        ],
        exampleMap
      )
    ).toBe(336);
  });

  it("should count trees on map with slope (input)", function () {
    expect(
      countTreeEncounters(inputTreeMap, {
        right: 3,
        down: 1,
      })
    ).toMatchInlineSnapshot(`230`);
  });

  it("should multiply together the number of trees encountered on each of the listed slopes (input)", () => {
    expect(
      calcProductOfTreeEncountersForSlopesOnMap(
        [
          { right: 1, down: 1 },
          { right: 3, down: 1 },
          { right: 5, down: 1 },
          { right: 7, down: 1 },
          { right: 1, down: 2 },
        ],
        inputTreeMap
      )
    ).toMatchInlineSnapshot(`9533698720`);
  });
});
