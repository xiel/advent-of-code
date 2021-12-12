import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day 10: Syntax Scoring", () => {
  const example = readExampleIntoLines(`
    [({(<(())[]>[[{[]{<()<>>
    [(()[<>])]({[<{<<[]>>(
    {([(<{}[<>[]}>{[]{[(<()>
    (((({<>}<{<{<>}{[]{[]{}
    [[<[([]))<([[{}[[()]]]
    [{[{({}]{}}([{[{{{}}([]
    {<[[]]>}<{[{[{[]{()[[[]
    [<(<(<(<{}))><([]([]()
    <{([([[(<>()){}]>(<<{{
    <{([{{}}[<[[[<>{}]]]>[]]
  `);
  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 1", () => {
    expect(parse(example).syntaxErrorScore).toBe(26397);
    expect(parse(input).syntaxErrorScore).toBe(387363);
  });

  test("Part 2 - What is the middle score?", () => {
    expect(parse(example).middleScore).toBe(288957);
    expect(parse(input).middleScore).toBe(4330777059);
  });
});

const opener = ["(", "[", "{", "<"];
const closer = [")", "]", "}", ">"];
const scoresForChar = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const autoCompleteScoreForChar = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

type CloseChar = keyof typeof scoresForChar;

function parse(lines: string[]) {
  let syntaxErrorScore = 0;

  const parsedLines = lines.map(parseLine);

  const sortedByAutoCompleteScore = parsedLines
    .filter((l) => l?.autoCompleteScore)
    .map((l) => l!.autoCompleteScore)
    .sort((a, b) => a - b);

  const middleScore =
    sortedByAutoCompleteScore[Math.floor(sortedByAutoCompleteScore.length / 2)];

  return {
    syntaxErrorScore,
    middleScore,
  };

  function parseLine(line: string) {
    const chars = line.split("");
    const expectCloseStack = [];

    for (const char of chars) {
      if (opener.includes(char)) {
        const closeChar = closer[opener.indexOf(char)];
        expectCloseStack.push(closeChar);
      } else if (closer.includes(char)) {
        const expectedClose = expectCloseStack.pop();
        if (expectedClose !== char) {
          syntaxErrorScore += scoresForChar[char as CloseChar];
          return;
        }
      }
    }

    if (expectCloseStack.length) {
      const autoCompleteScore = [...expectCloseStack]
        .reverse()
        .reduce((acc, char) => {
          const scoreForChar = autoCompleteScoreForChar[char as CloseChar];
          return acc * 5 + scoreForChar;
        }, 0);

      return {
        autoCompleteScore,
      };
    }
  }
}
