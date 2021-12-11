import { readFileIntoLines } from "../../utils/readFile";
import { ConwayCubes } from "./ConwayCubes";
import { ConwayHyperCubes } from "./ConwayHyperCube";

describe("Day 17 - Conway Cubes", () => {
  describe("Part I - Cubes (3 dimensions)", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);

      expect(
        ConwayCubes({
          initialState: example,
        }).activeCells.size
      ).toEqual(112);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);

      expect(
        ConwayCubes({
          initialState: input,
        }).activeCells.size
      ).toEqual(368);
    });
  });

  describe("Part II - Hypercube (4 dimensions)", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);

      expect(
        ConwayHyperCubes({
          initialState: example,
        }).activeCells.size
      ).toEqual(848);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);

      expect(
        ConwayHyperCubes({
          initialState: input,
        }).activeCells.size
      ).toEqual(2696);
    });
  });
});
