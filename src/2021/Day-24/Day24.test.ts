import { readFileIntoLines } from "../../utils/readFile";
import { solveDay24 } from "./day24";

// https://adventofcode.com/2021/day/24
describe("Day 24: Arithmetic Logic Unit", () => {
  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 1 & Part 2", () => {
    const res = solveDay24(input);
    expect(res.max).toBe(59692994994998);
    expect(res.min).toBe(16181111641521);
  });
});
