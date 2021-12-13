import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day 6: Lanternfish", () => {
  const example = readExampleIntoLines(`
    3,4,3,1,2
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 & Part 02", () => {
    solve(example, (day, numberOfFish) => {
      if (day === 18) expect(numberOfFish).toBe(26);
      if (day === 80) expect(numberOfFish).toBe(5934);
      if (day === 256) expect(numberOfFish).toBe(26984457539);
      if (day === 256) return true;
    });

    solve(input, (day, numberOfFish) => {
      if (day === 80) expect(numberOfFish).toBe(350917);
      if (day === 256) expect(numberOfFish).toBe(1592918715629);
      if (day === 256) return true;
    });
  });
});

function solve(
  lines: string[],
  onDay: (day: number, numberOfFish: number) => void | true,
  maxDays = 999
) {
  // Every fish has a timer state (from 0 to 8 = 9 possible states)
  const numberOfFishWithTimer = new Array<number>(9).fill(0);

  // Populate state with initial fish
  const initialFishes = lines[0].split(",").map((s) => parseInt(s, 10));
  initialFishes.forEach((value) => {
    numberOfFishWithTimer[value]++;
  });

  let dayCount = 0;

  while (dayCount < maxDays) {
    dayCount++;

    // Fish with timer state at 0 will reproduce
    const fishReproducing = numberOfFishWithTimer[0];

    // All other fish states decrease by 1, so their count is moved
    numberOfFishWithTimer.forEach((fishCount, timerValue) => {
      if (!timerValue) return;
      numberOfFishWithTimer[timerValue - 1] = fishCount;
    });

    // Fish reproducing will reset to state 6 and each adds new fish with state 8
    numberOfFishWithTimer[6] += fishReproducing;
    numberOfFishWithTimer[8] = fishReproducing;

    if (onDay(dayCount, getNumberOfFish())) break;
  }

  function getNumberOfFish() {
    return numberOfFishWithTimer.reduce((a, b) => a + b, 0);
  }
}
