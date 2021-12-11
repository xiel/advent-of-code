import { readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/2
describe("Day 2: Dive!", () => {
  test("01", () => {
    const commands = readFileIntoLines(__dirname + "/input.txt");
    const result = commands.reduce(
      (acc, curr) => {
        const [op, a] = curr.split(" ");
        const ai = parseInt(a);
        switch (op) {
          case "forward":
            acc.horizontal += ai;
            break;
          case "up":
            acc.depth -= ai;
            break;
          case "down":
            acc.depth += ai;
            break;
          default:
            throw new Error("Unknown op");
        }
        return acc;
      },
      {
        horizontal: 0,
        depth: 0,
      }
    );

    expect(result.depth * result.horizontal).toBe(1698735);
  });

  test("02", () => {
    const commands = readFileIntoLines(__dirname + "/input.txt");
    const result = commands.reduce(
      (acc, curr) => {
        const [op, a] = curr.split(" ");
        const ai = parseInt(a);
        switch (op) {
          case "forward":
            acc.horizontal += ai;
            acc.depth += acc.aim * ai;
            break;
          case "up":
            acc.aim -= ai;
            break;
          case "down":
            acc.aim += ai;
            break;
          default:
            throw new Error("Unknown op");
        }
        return acc;
      },
      {
        horizontal: 0,
        depth: 0,
        aim: 0,
      }
    );

    expect(result.depth * result.horizontal).toBe(1594785890);
  });
});
