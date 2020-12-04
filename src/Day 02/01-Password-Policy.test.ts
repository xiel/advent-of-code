import { filterValidPasswords } from "./filterValidPasswords";
import { passwordDBEntries } from "./input";

describe("Password Philosophy", () => {
  it("should work on provided example data", () => {
    const entries = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"];
    expect(filterValidPasswords(entries).length).toBe(2);
  });

  it("should work on puzzle input", function () {
    expect(
      filterValidPasswords(passwordDBEntries).length
    ).toMatchInlineSnapshot(`456`);
  });
});
