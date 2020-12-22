import { readFileIntoGroups } from "../utils/readFile";
import { playCombat } from "./CrabCombat";

describe("Day 21 -  Crab Combar", () => {
  describe("Part I - Whats the Winners score?", () => {
    test("Example", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/example.txt`);
      expect(playCombat(input)).toEqual(306);
    });

    test("Input", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/input.txt`);
      expect(playCombat(input)).toEqual(34127);
    });
  });
});
