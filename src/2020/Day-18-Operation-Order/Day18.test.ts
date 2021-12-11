import { readFileIntoLines } from "../../utils/readFile";
import { calcSum, evaluateMathyExpression } from "./OperationOrder";

describe("Day 18", () => {
  describe("Part I", () => {
    test("Example", () => {
      expect(evaluateMathyExpression("1 + 2 * 3 + 4 * 5 + 6")).toEqual(71);
      expect(evaluateMathyExpression("1 + (2 * 3) + (4 * (5 + 6))")).toEqual(
        51
      );
      expect(evaluateMathyExpression("2 * 3 + (4 * 5)")).toEqual(26);
      expect(evaluateMathyExpression("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toEqual(
        437
      );
      expect(
        evaluateMathyExpression("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")
      ).toEqual(12240);
      expect(
        evaluateMathyExpression(
          "0 + ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + (2 + 4) * 2"
        )
      ).toEqual(13632);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(calcSum(input)).toMatchInlineSnapshot(`4940631886147`);
    });
  });

  describe("Part II - Addition First", () => {
    test("Example", () => {
      expect(evaluateMathyExpression("1 + 2 * 3 + 4 * 5 + 6", true)).toEqual(
        231
      );
      expect(
        evaluateMathyExpression("1 + (2 * 3) + (4 * (5 + 6))", true)
      ).toEqual(51);
      expect(evaluateMathyExpression("2 * 3 + (4 * 5)", true)).toEqual(46);
      expect(
        evaluateMathyExpression("5 + (8 * 3 + 9 + 3 * 4 * 3)", true)
      ).toEqual(1445);
      expect(
        evaluateMathyExpression(
          "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))",
          true
        )
      ).toEqual(669060);
      expect(
        evaluateMathyExpression(
          "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + (2 + 4) * 2",
          true
        )
      ).toEqual(23340);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(calcSum(input, true)).toMatchInlineSnapshot(`283582817678281`);
    });
  });
});
