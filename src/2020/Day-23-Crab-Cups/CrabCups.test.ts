import { playCrabCups, prepareOneMillionCups } from "./CrabCups";

describe("Day 23 - Crab Cups", () => {
  describe("Part I - What are the labels on the cups after cup 1?", () => {
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
    test("Example", () => {
      const input = "389125467";
      expect(
        playCrabCups(prepareOneMillionCups(input), 10_000_000).productOfNextTwo
      ).toEqual(149245887792);
    });

    test("Input", () => {
      const input = "459672813";
      expect(
        playCrabCups(prepareOneMillionCups(input), 10_000_000).productOfNextTwo
      ).toEqual(219634632000);
    });
  });
});
