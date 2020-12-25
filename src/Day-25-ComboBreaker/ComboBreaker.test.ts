import { findEncryptionKey } from "./ComboBreaker";

describe("Day 25 - Combo Breaker", () => {
  describe("Part I & II", () => {
    test("Example", () => {
      expect(findEncryptionKey(17807724, 5764801)).toEqual(14897079);
    });

    test("Input", () => {
      expect(findEncryptionKey(12090988, 240583)).toEqual(3015200);
    });
  });
});
