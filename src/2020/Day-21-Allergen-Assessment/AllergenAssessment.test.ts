import { readFileIntoLines } from "../../utils/readFile";
import { findAllergenFreeIngredients } from "./AllergenAssessment";

describe("Day 21 -  Allergen Assessment", () => {
  describe("Part I - How many times do any of those ingredients appear?", () => {
    test("Example", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(
        findAllergenFreeIngredients(input)
          .appearanceCountOfAllergenFreeIngredients
      ).toEqual(5);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(
        findAllergenFreeIngredients(input)
          .appearanceCountOfAllergenFreeIngredients
      ).toEqual(2798);
    });
  });

  describe("Part II - What is your canonical dangerous ingredient list?", () => {
    test("Example", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/example.txt`);

      expect(
        findAllergenFreeIngredients(input).canonicalDangerousIngredientList
      ).toEqual("mxmxvkd,sqjhc,fvjkl");
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(
        findAllergenFreeIngredients(input).canonicalDangerousIngredientList
      ).toEqual("gbt,rpj,vdxb,dtb,bqmhk,vqzbq,zqjm,nhjrzzj");
    });
  });
});
