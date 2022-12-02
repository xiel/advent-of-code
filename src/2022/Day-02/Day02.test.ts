import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

const exampleGuide = `A Y
B X
C Z`;

// https://adventofcode.com/2022/day/2
describe("Day 02", () => {
  test("Example", () => {
    expect(part1(readExampleIntoLines(exampleGuide))).toEqual(15);
  });

  test("Part 1", () => {
    expect(part1(readFileIntoLines(__dirname + "/input.txt"))).toEqual(10994);
  });

  test("Part 2", () => {
    //...
  });
});

// A for Rock, B for Paper, and C for Scissors
// X for Rock, Y for Paper, and Z for Scissors
// Your total score is the sum of your scores for each round.

const meanings = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
  X: "Rock",
  Y: "Paper",
  Z: "Scissors",
} as const;

type Move = keyof typeof meanings;

const scores = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

const beats = {
  Rock: "Scissors",
  Paper: "Rock",
  Scissors: "Paper",
} as const;

function part1(guide: string[]) {
  let myTotalScore = 0;

  for (const [opponent, , me] of guide) {
    const [moveOpp, moveMe] = [
      meanings[opponent as Move],
      meanings[me as Move],
    ] as const;

    // The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
    let roundScore = scores[moveMe];

    // plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
    if (moveOpp === moveMe) {
      // Draw
      roundScore += 3;
    } else if (beats[moveMe] === moveOpp) {
      // I won
      roundScore += 6;
    } else {
      // They won
      roundScore += 0;
    }

    myTotalScore += roundScore;
  }

  return myTotalScore;
}
