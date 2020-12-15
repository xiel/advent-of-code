import { readFileIntoLines } from "../utils/readFile";

describe("Day 15", () => {
  describe("Part I", () => {
    test("Example", () => {
      expect(playMemory("0,3,6", 2020)).toEqual(436);
      expect(playMemory("1,3,2", 2020)).toEqual(1);
      expect(playMemory("3,1,2", 2020)).toEqual(1836);
    });

    test("Input", () => {
      expect(playMemory("0,20,7,16,1,18,15", 2020)).toEqual(1025);
    });
  });

  describe.skip("Part II", () => {
    //...
  });
});

function playMemory(listStr: string, turnToReturn: number) {
  const initialList = listStr.split(",").map((n) => Number(n));
  const lastPlayedAtMap = new Map<number, [number, number]>();
  let mostRecentNum = NaN;
  let turnNo = initialList.length;

  // index = 1 based
  initialList.forEach((num, i) => {
    const turn = i + 1;
    lastPlayedAtMap.set(num, [-1, turn]);
    mostRecentNum = num;
  });

  while (turnNo < turnToReturn) {
    turnNo++;

    if (lastPlayedAtMap.has(mostRecentNum)) {
      const [beforeOlder, beforeNewer] = lastPlayedAtMap.get(mostRecentNum)!;

      if (beforeOlder > -1) {
        const newNum = beforeNewer - beforeOlder;
        addNum(newNum);
        mostRecentNum = newNum;
      } else {
        addNum(0);
        mostRecentNum = 0;
      }
    } else {
      addNum(0);
      mostRecentNum = 0;
    }

    if (turnNo === turnToReturn) {
      return mostRecentNum;
    }
  }

  function addNum(num: number, atTurn = turnNo) {
    if (lastPlayedAtMap.has(num)) {
      const [_, beforeNewer] = lastPlayedAtMap.get(num)!;
      lastPlayedAtMap.set(num, [beforeNewer, atTurn]);
    } else {
      lastPlayedAtMap.set(num, [-1, atTurn]);
    }
  }

  return mostRecentNum;
}
