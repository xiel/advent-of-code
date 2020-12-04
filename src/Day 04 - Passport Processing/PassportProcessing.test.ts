import * as fs from "fs";
import { countValidPassports } from "./passportProcessing";

function readFile(filename: string) {
  return fs.readFileSync(`${__dirname}/${filename}`, "utf-8");
}

describe("Passport Processing", () => {
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
