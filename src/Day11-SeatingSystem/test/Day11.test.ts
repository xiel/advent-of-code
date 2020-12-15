import { readFileIntoLines } from "../../utils/readFile";
import {
  countOccupiedSeatInSeatMap,
  gameOfSeatingSystem,
} from "../src/GameOfSeatingSystem";

describe("Day 11 - Seating System", () => {
  describe("Part I", () => {
    test("Example", () => {
      const list = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const splitSeats = list.map((row) => row.split(""));
      const exampleEnd = [
        "#.#L.L#.##",
        "#LLL#LL.L#",
        "L.#.L..#..",
        "#L##.##.L#",
        "#.#L.LL.LL",
        "#.#L#L#.##",
        "..L.L.....",
        "#L#L##L#L#",
        "#.LLLLLL.L",
        "#.#L#L#.##",
      ];

      // How many seats end up occupied?
      const seatMapAtEnd = gameOfSeatingSystem(splitSeats);
      expect(seatMapAtEnd.map((row) => row.join(""))).toEqual(exampleEnd);
      expect(countOccupiedSeatInSeatMap(seatMapAtEnd)).toEqual(37);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const splitSeats = input.map((row) => row.split(""));

      // How many seats end up occupied?
      const seatMapAtEnd = gameOfSeatingSystem(splitSeats);
      expect(countOccupiedSeatInSeatMap(seatMapAtEnd)).toMatchInlineSnapshot(
        `2222`
      );
    });
  });

  describe("Part II", () => {
    test("Example", () => {
      const list = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const splitSeats = list.map((row) => row.split(""));
      const exampleEnd2 = [
        "#.L#.L#.L#",
        "#LLLLLL.LL",
        "L.L.L..#..",
        "##L#.#L.L#",
        "L.L#.LL.L#",
        "#.LLLL#.LL",
        "..#.L.....",
        "LLL###LLL#",
        "#.LLLLL#.L",
        "#.L#LL#.L#",
      ];

      // How many seats end up occupied?
      const seatMapAtEnd = gameOfSeatingSystem(splitSeats, true);
      expect(seatMapAtEnd.map((row) => row.join(""))).toEqual(exampleEnd2);
      expect(countOccupiedSeatInSeatMap(seatMapAtEnd)).toEqual(26);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const splitSeats = input.map((row) => row.split(""));

      // How many seats end up occupied?
      const seatMapAtEnd = gameOfSeatingSystem(splitSeats, true);
      expect(countOccupiedSeatInSeatMap(seatMapAtEnd)).toMatchInlineSnapshot(
        `2032`
      );
    });
  });
});
