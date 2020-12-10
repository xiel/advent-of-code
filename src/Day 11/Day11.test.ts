import { readFileIntoLines } from "../utils/readFile";

describe("Day 11", () => {
  describe("Part I", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(fn(numList)).toEqual(undefined);
    });

    // test("Input", () => {
    //   const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
    //   const numList = example.map((ns) => Number(ns));
    //   expect(fn(numList)).toMatchInlineSnapshot();
    // });
  });
});

function fn(list: number[]) {
  return undefined;
}
