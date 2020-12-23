import { playCrabCups, prepareOneMillionCups, takeOut } from "./Day23";

describe("Day 23 - Crab Cups", () => {
  describe("Part I - What are the labels on the cups after cup 1?", () => {
    test("take out", () => {
      expect(takeOut(3, 8, [8, 3, 6, 7, 4, 1, 9, 2, 5])).toEqual([
        [5, 8, 3],
        [6, 7, 4, 1, 9, 2],
      ]);
    });

    test("Example", () => {
      const input = "389125467";
      expect(playCrabCups(input, 10).numsAfterOne).toEqual("92658374");
      expect(playCrabCups(input, 100).numsAfterOne).toEqual("67384529");
    });

    test("Input", () => {
      const input = "459672813";
      expect(playCrabCups(input, 100).numsAfterOne).toEqual("68245739");
      expect(playCrabCups(input, 100).productOfNextTwo).toEqual(48);
    });
  });

  describe("Part II -  One Mio Cups, 10 Mio Rounds", () => {
    test.skip("Example", () => {
      const input = "389125467";
      expect(
        playCrabCups(prepareOneMillionCups(input), 10_000_000).productOfNextTwo
      ).toEqual(149245887792);
    });

    test("Input", () => {
      const input = "459672813";
      expect(
        playCrabCups(prepareOneMillionCups(input), 10_000).productOfNextTwo
      ).toEqual(-1);
    });
  });
});
