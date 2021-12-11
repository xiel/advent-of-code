import * as fs from "fs";
import { countValidPassports } from "./passportProcessing";

function readFile(filename: string) {
  return fs.readFileSync(`${__dirname}/${filename}`, "utf-8");
}

describe("Passport Processing - non strict", () => {
  it("should count valid passports with cid optional (example)", () => {
    const passportBatchFileText = readFile("example.txt");
    expect(countValidPassports(passportBatchFileText)).toBe(2);
  });

  it("should count valid passports with cid optional (input)", () => {
    const passportBatchFileText = readFile("input.txt");
    expect(countValidPassports(passportBatchFileText)).toMatchInlineSnapshot(
      `228`
    );
  });
});

describe("Passport Processing - strict", () => {
  it("should count strictly valid passports with cid optional (examples)", () => {
    expect(
      countValidPassports(readFile("exampleStrictInvalid.txt"), true)
    ).toBe(0);
    expect(countValidPassports(readFile("exampleStrictValid.txt"), true)).toBe(
      4
    );
  });

  it("should count strictly valid passports with cid optional (input)", () => {
    expect(
      countValidPassports(readFile("input.txt"), true)
    ).toMatchInlineSnapshot(`175`);
  });
});
