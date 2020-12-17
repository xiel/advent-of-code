import { readFileIntoLines } from "../utils/readFile";
import { ConwayCubes } from "./ConwayCubes";

describe("Day 17 - Conway Cubes", () => {
  describe("Part I - ...", () => {
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
      ).toEqual(-1);
    });
  });

  // describe.skip("Part II - ...", () => {
  //   test("Example", () => {
  //     const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
  //     expect(fn(example)).toEqual(0);
  //   });
  //
  //   test.skip("Input", () => {
  //     const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
  //     expect(fn(input)).toEqual(0);
  //   });
  // });
});
