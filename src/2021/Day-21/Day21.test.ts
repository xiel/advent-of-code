import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day XX", () => {
  const example = readExampleIntoLines(`
    Player 1 starting position: 4
    Player 2 starting position: 8
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - ...", () => {
    expect(solve(example).loserDiceProduct).toBe(739785);
    expect(solve(input).loserDiceProduct).toBe(998088);
  });

  test("Part 02 - ..", () => {
    // ...
  });
});

function solve(lines: string[]) {
  const [player1, player2] = lines.map((s, i) => ({
    // ten spaces marked 1 through 10 clockwise (we use index here)
    playerNo: i + 1,
    pos: +s.split(": ")[1] - 1,
    score: 0,
  }));

  let currentPlayer = player1;
  const dice = createDeterministicDice();

  while (player1.score < 1000 && player2.score < 1000) {
    // On each player's turn, the player rolls the die three times and adds up the results.
    // Then, the player moves their pawn that many times forward around the track
    const rolls = [dice.roll(), dice.roll(), dice.roll()];
    const rollsSum = rolls.reduce((a, b) => a + b, 0);

    currentPlayer.pos = (currentPlayer.pos + rollsSum) % 10;
    currentPlayer.score += currentPlayer.pos + 1;

    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  const looser = player1.score < player2.score ? player1 : player2;

  return {
    // what do you get if you multiply the score of the losing player by the number of times the die was rolled during the game?
    loserDiceProduct: looser.score * dice.rollsCount,
  };

  function createDeterministicDice(size = 100) {
    let rollsCount = 0;
    let diceAtIndex = 0;
    return {
      get rollsCount() {
        return rollsCount;
      },
      roll: () => {
        rollsCount++;
        const value = diceAtIndex + 1;
        diceAtIndex = (diceAtIndex + 1) % size;
        return value;
      },
    };
  }
}
