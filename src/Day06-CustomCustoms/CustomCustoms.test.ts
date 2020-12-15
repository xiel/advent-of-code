import { readFileSync } from "fs";
import {
  countChoicesInGroups,
  countUnanimousChoicesInGroups,
} from "./CustomCustoms";

describe("Custom Customs", () => {
  it("should count choices once (example)", () => {
    expect(
      countChoicesInGroups(readFileLinesIntoGroups("fixtures/example.txt"))
    ).toEqual(11);
  });

  it("should count choices once (input)", () => {
    expect(
      countChoicesInGroups(readFileLinesIntoGroups("fixtures/input.txt"))
    ).toMatchInlineSnapshot(`6703`);
  });
});

describe("Custom Customs - Unanimous Choices", () => {
  it("should count unanimous choices (example)", () => {
    expect(
      countUnanimousChoicesInGroups(
        readFileLinesIntoGroups("fixtures/example.txt")
      )
    ).toEqual(6);
  });

  it("should count unanimous choices (input)", () => {
    expect(
      countUnanimousChoicesInGroups(
        readFileLinesIntoGroups("fixtures/input.txt")
      )
    ).toMatchInlineSnapshot(`3430`);
  });
});

function readFileLinesIntoGroups(filename: string) {
  return readFileSync(`${__dirname}/${filename}`, "utf-8")
    .split("\n\n")
    .map((group) => group.split("\n").filter(Boolean));
}
