import { readFileIntoLines } from "../../utils/readFile";

describe("Day 7: The Treachery of Whales", () => {
  const input = readFileIntoLines(__dirname + "/input.txt")[0];

  test("Part 01 - How much fuel must they spend to align to that position?", () => {
    expect(solve("16,1,2,0,4,2,7,1,2,14")).toBe(37);
    expect(solve(input)).toBe(325528);
  });

  test("Part 02 - How much fuel must they spend to align to that position?", () => {
    expect(solve2("16,1,2,0,4,2,7,1,2,14")).toBe(168);
    expect(solve2(input)).toBeLessThan(85015849);
    expect(solve2(input)).toBe(85015836);
  });
});

function solve(posStr: string) {
  const pos = posStr.split(",").map((s) => parseInt(s, 10));
  const posSorted = pos.sort((a, b) => a - b);
  const middleIndex = Math.round(pos.length / 2);
  const median = posSorted[middleIndex];
  return posSorted.reduce((a, b) => a + Math.abs(median - b), 0);
}

function solve2(posStr: string) {
  const positions = posStr.split(",").map((s) => +s);

  let bestScore = Number.MAX_SAFE_INTEGER;

  for (let target = 0; target <= positions[positions.length - 1]; target++) {
    let score = 0;

    for (const pos of positions) {
      const distance = Math.abs(pos - target);
      score += (distance * (distance + 1)) / 2;
      if (score > bestScore) break;
    }

    if (score < bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
}
