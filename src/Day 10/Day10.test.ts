import { readFileIntoLines } from "../utils/readFile";

describe("Day 10", () => {
  describe("Part I", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(makeChainCountJoltageDiffs(numList)).toEqual({
        1: 7,
        3: 5,
      });
    });

    test("Example 2", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example2.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(makeChainCountJoltageDiffs(numList)).toEqual({
        1: 22,
        3: 10,
      });
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(
        mutliplyDiffs(makeChainCountJoltageDiffs(numList))
      ).toMatchInlineSnapshot(`2046`);
    });
  });

  describe("Part II", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(countDistinctWaysOfConnecting(numList)).toEqual(8);
    });

    test("Example 2", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example2.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(countDistinctWaysOfConnecting(numList)).toEqual(19208);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const numList = example.map((ns) => Number(ns));
      expect(countDistinctWaysOfConnecting(numList)).toMatchInlineSnapshot(
        `1157018619904`
      );
    });
  });
});

// charging outlet has an effective rating of 0 jolts
// so the only adapters that could connect to it directly would need to have a joltage rating of 1, 2, or 3 jolts
// adapters can only connect to a source 1-3 jolts lower than its rating
// your device's built-in adapter is always 3 higher than the highest adapter, so its rating is 22 jolts (always a difference of 3).

const possibleJoltageDiffs = [1, 2, 3];

function makeChainCountJoltageDiffs(joltages: number[]) {
  let currentJoltage = 0;
  const fullSet = new Set(joltages);
  const deviceJoltage = Math.max(...joltages) + 3;
  const diffs: Record<number, number> = {};

  while (currentJoltage < deviceJoltage - 3) {
    const foundApater = possibleJoltageDiffs.find((possibleDiff) => {
      const testJoltage = currentJoltage + possibleDiff;

      if (fullSet.has(testJoltage)) {
        diffs[possibleDiff] = (diffs[possibleDiff] || 0) + 1;
        currentJoltage = testJoltage;
        return true;
      }
    });

    if (!foundApater) {
      break;
    }
  }

  // last adapter to device
  diffs[3] += 1;

  return diffs;
}

function mutliplyDiffs(diffs: Record<number, number>) {
  return diffs[1] * diffs[3];
}

// What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?
function countDistinctWaysOfConnecting(joltages: number[]) {
  const fullSet = new Set(joltages);
  const deviceJoltage = Math.max(...joltages) + 3;
  const countMemory = new Map<number, number>();

  function canReachEndWithConnections(startJoltage: number) {
    let connectionsFromHere = 0;

    for (const possibleDiff of possibleJoltageDiffs) {
      const testJoltage = startJoltage + possibleDiff;

      // this is the adapter before connecting to the device
      if (testJoltage === deviceJoltage - 3) {
        connectionsFromHere++;
      } else if (fullSet.has(testJoltage)) {
        if (countMemory.has(testJoltage)) {
          connectionsFromHere += countMemory.get(testJoltage)!;
        } else {
          const count = canReachEndWithConnections(testJoltage);
          countMemory.set(testJoltage, count);
          connectionsFromHere += count;
        }
      }
    }

    return connectionsFromHere;
  }

  return canReachEndWithConnections(0);
}
