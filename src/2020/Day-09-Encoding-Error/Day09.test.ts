import { readFileIntoLines } from "../../utils/readFile";

describe("Day 9", () => {
  describe("Part I", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(firstNumNotSumOfPrev(5, numList)).toEqual(127);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(firstNumNotSumOfPrev(25, numList)).toMatchInlineSnapshot(
        `22406676`
      );
    });
  });

  describe("Part II", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(findEncryptionWeakness(127, numList)).toEqual(62);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(findEncryptionWeakness(22406676, numList)).toMatchInlineSnapshot(
        `2942387`
      );
    });
  });
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

// find a contiguous set of at least two numbers in your list which sum to the invalid number from step 1.
function findEncryptionWeakness(searchNum: number, list: number[]) {
  let foundSum = NaN;

  list.find((currentNum, currentI, arr) => {
    const currentList: number[] = [currentNum];
    let currentSum = currentNum;
    let i = currentI + 1;

    while (currentSum <= searchNum && i < arr.length) {
      currentSum += arr[i];
      currentList.push(arr[i]);

      if (currentSum === searchNum) {
        const min = Math.min(...currentList);
        const max = Math.max(...currentList);
        foundSum = min + max;
        return true;
      }

      i++;
    }
  });

  return foundSum;
}
