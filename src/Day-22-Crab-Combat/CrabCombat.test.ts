import { readFileIntoGroups } from "../utils/readFile";
import { playCombat } from "./CrabCombat";
import { startRecursiveCombat } from "./RecursiveCombat";

describe("Day 21 -  Crab Combat", () => {
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

  describe("Part II - Recursive Combat", () => {
    test("Example", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/example.txt`);
      expect(startRecursiveCombat(input)).toEqual(291);
    });

    test("Input", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/input.txt`);
      expect(startRecursiveCombat(input)).toEqual(32054);
    });
  });
});
