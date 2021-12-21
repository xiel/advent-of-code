import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/21
describe("Day 21: Dirac Dice", () => {
  const example = readExampleIntoLines(`
    Player 1 starting position: 4
    Player 2 starting position: 8
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - What do you get if you multiply the score of the losing player by the number of times the die was rolled during the game?", () => {
    expect(solve(example).loserDiceProduct).toBe(739785);
    expect(solve(input).loserDiceProduct).toBe(998088);
  });

  test("Part 02 - Find the player that wins in more universes; in how many universes does that player win?", () => {
    const exampleResult = playWithDiracDice(example);
    expect(exampleResult.mostWinsPlayer).toBe(444356092776315);
    expect(exampleResult.player2Wins).toBe(341960390180808);

    const inputResult = playWithDiracDice(input);
    expect(inputResult.mostWinsPlayer).toBeGreaterThan(174764712967663);
    expect(inputResult.mostWinsPlayer).toBe(306621346123766);
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
  const endScore = 1000;

  while (player1.score < endScore && player2.score < endScore) {
    // On each player's turn, the player rolls the die three times and adds up the results.
    // Then, the player moves their pawn that many times forward around the track
    const rolls = [dice.roll(), dice.roll(), dice.roll()];
    const rollsSum = rolls.reduce((a, b) => a + b, 0);
    currentPlayer.pos = (currentPlayer.pos + rollsSum) % 10;
    currentPlayer.score += currentPlayer.pos + 1;
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  const [winner, looser] =
    player1.score > player2.score ? [player1, player2] : [player2, player1];

  return {
    // what do you get if you multiply the score of the losing player by the number of times the die was rolled during the game?
    loserDiceProduct: looser.score * dice.rollsCount,
    winner,
    looser,
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

// Dirac dice - a single three-sided die
// Splits into multiple copies, one copy for each possible outcome of the die.
function playWithDiracDice(lines: string[]) {
  const [player1, player2] = lines.map((s, i) => ({
    playerNo: i + 1,
    initialPos: +s.split(": ")[1] - 1,
    wins: 0,
  }));
  const winningScore = 21;
  const winsMemoryFrom = new Map<string, [number, number]>();

  const [player1Wins, player2Wins] = countWinsFrom(
    player1.initialPos,
    player2.initialPos,
    0,
    0
  );

  const mostWinsPlayer = player1Wins > player2Wins ? player1Wins : player2Wins;

  return {
    mostWinsPlayer,
    player1Wins,
    player2Wins,
  };

  function countWinsFrom(
    p1: number,
    p2: number,
    s1: number,
    s2: number
  ): [number, number] {
    if (s1 >= winningScore) {
      return [1, 0];
    }
    if (s2 >= winningScore) {
      return [0, 1];
    }
    if (winsMemoryFrom.has(_(p1, p2, s1, s2))) {
      return winsMemoryFrom.get(_(p1, p2, s1, s2))!;
    }

    let wins: [number, number] = [0, 0];

    for (const d1 of [1, 2, 3]) {
      for (const d2 of [1, 2, 3]) {
        for (const d3 of [1, 2, 3]) {
          const p1New = (p1 + d1 + d2 + d3) % 10;
          const s1New = s1 + p1New + 1;
          const [x1, y1] = countWinsFrom(p2, p1New, s2, s1New);
          wins = [wins[0] + y1, wins[1] + x1];
        }
      }
    }
    winsMemoryFrom.set(_(p1, p2, s1, s2), wins);
    return wins;
  }

  function _(...args: unknown[]) {
    return JSON.stringify(args);
  }
}
