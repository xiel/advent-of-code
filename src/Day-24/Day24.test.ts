import { lobbyLayout } from "./Day24";
import { readFileIntoLines } from "../utils/readFile";

describe("Day 24", () => {
  describe("Part I", () => {
    test("Example", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(lobbyLayout(input)).toEqual(10);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(lobbyLayout(input)).toEqual(300);
    });
  });

  describe("Part II", () => {
    test("Example", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(lobbyLayout(input, 100)).toEqual(2208);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(lobbyLayout(input, 100)).toEqual(3466);
    });
  });
});
