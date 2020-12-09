import { readFileIntoLines } from "../utils/readFile";

describe("Day 9", () => {
  describe("Part I", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(
        firstNumNotSumOfPrev(
          5,
          example.map((ns) => Number(ns))
        )
      ).toEqual(127);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(
        firstNumNotSumOfPrev(
          25,
          example.map((ns) => Number(ns))
        )
      ).toMatchInlineSnapshot(`22406676`);
    });
  });

  // describe("Part II", () => {
  //   test("Example", () => {
  //     const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
  //     expect(fn2(example)).toEqual(8);
  //   });
  //
  //   test("Input", () => {
  //     const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
  //     expect(fn2(example)).toMatchInlineSnapshot();
  //   });
  // });
});

function firstNumNotSumOfPrev(preamble: number, list: number[]) {
  let currentIndex = preamble;

  while (currentIndex < list.length) {
    const currentNum = list[currentIndex];
    const currentList = list.slice(currentIndex - preamble, currentIndex);
    const currentSet = new Set(currentList);
    const canMakeSum = currentList.find((num) => {
      const otherNum = Math.abs(currentNum - num);
      return currentSet.has(otherNum);
    });

    if (canMakeSum === undefined) {
      return currentNum;
    }

    currentIndex++;
  }
}
