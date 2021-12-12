import {
  readExampleIntoGroups,
  readFileIntoGroups,
} from "../../utils/readFile";

describe("Day 4: Giant Squid", () => {
  const example = readExampleIntoGroups(`
    7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
    
    22 13 17 11  0
     8  2 23  4 24
    21  9 14 16  7
     6 10  3 18  5
     1 12 20 15 19
    
     3 15  0  2 22
     9 18 13 17  5
    19  8  7 25 23
    20 11 10 24  4
    14 21 16 12  6
    
    14 21 17 24  4
    10 16 15  9 19
    18  8 23 26 20
    22 11 13  6  5
     2  0 12  3  7
  `);

  const input = readFileIntoGroups(__dirname + "/input.txt");

  test("Part 01 - What will your final score be if you choose that board?", () => {
    const resultExample = findBestBoardInBingoGame(example);
    expect(resultExample.finalScore).toBe(4512);

    const resultInput = findBestBoardInBingoGame(input);
    expect(resultInput.finalScore).toBe(87456);
  });

  test("Part 02 - Find last board that has a bingo, what would its final score be?", () => {
    const resultExample = findBestBoardInBingoGame(example, false);
    expect(resultExample.finalScore).toBe(1924);

    const resultInput = findBestBoardInBingoGame(input, false);
    expect(resultInput.finalScore).toBe(15561);
  });
});

function findBestBoardInBingoGame(bingoGame: string[], playToWin = true) {
  const [numbersDrawnStr, ...boardsStr] = bingoGame;
  const numbersDrawn = numbersDrawnStr.split(",").map((n) => parseInt(n, 10));
  const boards = boardsStr.map(parseBoard);

  let myBoard = boards[-1];
  let drawnNum = -1;
  let boardCountThatWon = 0;

  drawLoop: for (drawnNum of numbersDrawn) {
    for (const board of boards) {
      if (board.hasWon) continue;

      for (let y = 0; y < board.height; y++) {
        for (let x = 0; x < board.width; x++) {
          const numOnBoard = board.numbers2d[y][x];

          if (numOnBoard === drawnNum) {
            board.colMatches[x].push(drawnNum);
            board.rowMatches[y].push(drawnNum);

            if (
              board.colMatches[x].length === board.height ||
              board.rowMatches[y].length === board.width
            ) {
              if (playToWin) {
                myBoard = board;
                break drawLoop;
              } else {
                boardCountThatWon++;
                board.hasWon = true;

                if (boardCountThatWon === boards.length) {
                  myBoard = board;
                  break drawLoop;
                }
              }
            }
          }
        }
      }
    }
  }

  if (!myBoard) throw Error("no winning board found");

  const matches = new Set([...myBoard.rowMatches.flatMap((rm) => rm)]);
  const sumOfUnmarkedNumbers = myBoard.numbers2d
    .flatMap((r) => r)
    .filter((n) => !matches.has(n))
    .reduce((a, b) => a + b, 0);

  const finalScore = sumOfUnmarkedNumbers * drawnNum;

  return { finalScore };

  function parseBoard(boardStr: string) {
    const numbers2d = boardStr.split("\n").map((l) =>
      l
        .trim()
        .split(/\s+/)
        .map((n) => parseInt(n, 10))
    );

    const width = numbers2d[0].length;
    const height = numbers2d.length;

    return {
      width,
      height,
      numbers2d,
      hasWon: false,
      colMatches: Array.from({ length: width }, () => new Array<number>()),
      rowMatches: Array.from({ length: height }, () => new Array<number>()),
    };
  }
}
