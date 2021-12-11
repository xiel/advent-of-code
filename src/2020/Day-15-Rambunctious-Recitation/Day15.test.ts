describe("Day 15 - Rambunctious Recitation", () => {
  describe("Part I", () => {
    test("Example", () => {
      expect(playMemory("0,3,6", 2020)).toEqual(436);
      expect(playMemory("3,1,2", 2020)).toEqual(1836);
    });

    test("Input", () => {
      expect(playMemory("0,20,7,16,1,18,15", 2020)).toEqual(1025);
    });
  });

  describe("Part II", () => {
    test("Example", () => {
      expect(playMemory("0,3,6", 30_000_000)).toEqual(175594);
      expect(playMemory("3,1,2", 30_000_000)).toEqual(362);
    });

    test("Input", () => {
      expect(playMemory("0,20,7,16,1,18,15", 30_000_000)).toEqual(129262);
    });
  });
});

function playMemory(listStr: string, turnToReturn: number) {
  const initialList = listStr.split(",").map((n) => Number(n));

  let mostRecentNum = NaN;
  let turnNo = initialList.length;

  const mostRecentPlayedAt = new Map<number, number>();
  const prevPlayedAt = new Map<number, number>();

  initialList.forEach((num, i) => {
    mostRecentPlayedAt.set(num, i + 1); // turn is a 1-based index
    mostRecentNum = num;
  });

  while (turnNo < turnToReturn) {
    turnNo++;

    const mostRecent = mostRecentPlayedAt.get(mostRecentNum);
    const prev = prevPlayedAt.get(mostRecentNum);

    if (mostRecent !== undefined && prev !== undefined) {
      const newNum = mostRecent - prev;
      addNum(newNum);
      mostRecentNum = newNum;
    } else {
      addNum(0);
      mostRecentNum = 0;
    }

    if (turnNo === turnToReturn) {
      return mostRecentNum;
    }
  }

  function addNum(num: number, atTurn = turnNo) {
    const mostRecent = mostRecentPlayedAt.get(num);
    if (mostRecent !== undefined) {
      prevPlayedAt.set(num, mostRecent);
      mostRecentPlayedAt.set(num, atTurn);
    } else {
      mostRecentPlayedAt.set(num, atTurn);
    }
  }

  return mostRecentNum;
}
