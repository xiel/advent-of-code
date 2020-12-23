import { playCrabCups, takeOut } from "./Day23";

describe("Day 23 - Crab Cups", () => {
  describe("Part I - ...", () => {
    test("take out", () => {
      expect(takeOut(3, 8, [8, 3, 6, 7, 4, 1, 9, 2, 5])).toEqual([
        [5, 8, 3],
        [6, 7, 4, 1, 9, 2],
      ]);
    });

    test("Example", () => {
      const input = "389125467";
      expect(playCrabCups(input, 10)).toEqual("92658374");
      expect(playCrabCups(input, 100)).toEqual("67384529");
    });

    test("Input", () => {
      const input = "459672813";
      expect(playCrabCups(input, 100)).toEqual("-1");
    });
  });
});
