import { readFileIntoLines } from "../utils/readFile";
import { findAllergenFreeIngredients } from "./AllergenAssessment";

describe("Day 21 -  Allergen Assessment", () => {
  describe("Part I - How many times do any of those ingredients appear?", () => {
    test("Example", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(findAllergenFreeIngredients(input)).toEqual(5);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(findAllergenFreeIngredients(input)).toMatchInlineSnapshot(`2798`);
    });
  });
});
