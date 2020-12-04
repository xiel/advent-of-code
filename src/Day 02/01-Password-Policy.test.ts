import {
  filterValidPasswords,
  isValidPasswordValidSledRentalPlace,
  isValidPasswordValidTobogganCorporatePolicy,
} from "./filterValidPasswords";
import { passwordDBEntries } from "./input";

describe("Password Philosophy - sled rental place", () => {
  it("should work on provided example data", () => {
    const entries = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"];
    expect(
      filterValidPasswords(entries, isValidPasswordValidSledRentalPlace).length
    ).toBe(2);
  });

  it("should work on puzzle input", function () {
    expect(
      filterValidPasswords(
        passwordDBEntries,
        isValidPasswordValidSledRentalPlace
      ).length
    ).toMatchInlineSnapshot(`456`);
  });
});

describe("Password Philosophy - Toboggan Corporate", () => {
  it("should work on provided example data", () => {
    const entries = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"];
    expect(
      filterValidPasswords(entries, isValidPasswordValidTobogganCorporatePolicy)
        .length
    ).toBe(1);
  });

  it("should work on puzzle input", function () {
    expect(
      filterValidPasswords(
        passwordDBEntries,
        isValidPasswordValidTobogganCorporatePolicy
      ).length
    ).toMatchInlineSnapshot(`308`);
  });
});
