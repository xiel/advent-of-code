import { readFileIntoGroups } from "../../utils/readFile";

// https://adventofcode.com/2022/day/5
describe("Day 05", () => {
  test("Example", () => {
    expect(solve(readFileIntoGroups(__dirname + "/example.txt"))).toEqual(
      "CMZ"
    );
    expect(solve(readFileIntoGroups(__dirname + "/example.txt"), 9001)).toEqual(
      "MCD"
    );
  });

  test("Part 1", () => {
    expect(solve(readFileIntoGroups(__dirname + "/input.txt"))).toEqual(
      "FWNSHLDNZ"
    );
  });

  test("Part 2", () => {
    expect(solve(readFileIntoGroups(__dirname + "/input.txt"), 9001)).toEqual(
      "RNRGDNFQG"
    );
  });
});

function solve(str: string[], model: 9000 | 9001 = 9000) {
  const [stackStr, moveStr] = str;
  const stacks: string[][] = [];
  const stackStrLines = stackStr.split("\n");

  stackStrLines.forEach((line, i) => {
    if (i === stackStrLines.length - 1) return;

    const lineArr = Array.from(line);

    for (let j = 0; j < lineArr.length; j++) {
      if (lineArr[j - 1] === "[") {
        const letter = lineArr[j];
        const stackI = Math.floor((j + 1) / 4);
        stacks[stackI] = stacks[stackI] || [];
        stacks[stackI].unshift(letter);
      }
    }
  });

  moveStr
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const [count, from, to] = l.match(/\d+/g)?.map((n) => +n) || [];
      return { count, from, to };
    })
    .forEach((move) => {
      if (model === 9000) {
        for (let i = 0; i < move.count; i++) {
          stacks[move.to - 1].push(stacks[move.from - 1].pop()!);
        }
      } else if (model === 9001) {
        const from = stacks[move.from - 1];
        const to = stacks[move.to - 1];
        to.push(...from.splice(move.count * -1));
      } else throw Error("invalid model");
    });

  return stacks.map((s) => s[s.length - 1]).join("");
}
