import {
  findEmptySeatId,
  getMaxSeatId,
  parseBoardingPass,
  parseBoardingPasses,
} from "./BinaryBoarding";
import { readFileSync } from "fs";

describe("Binary Boarding", () => {
  it("should work on example", () => {
    expect(parseBoardingPass("FBFBBFFRLR")).toEqual({
      row: 44,
      column: 5,
      seatID: 357,
    });
  });

  it("should calc boarding pass id", () => {
    expect(parseBoardingPass("BFFFBBFRRR")).toEqual({
      row: 70,
      column: 7,
      seatID: 567,
    });
    expect(parseBoardingPass("FFFBBBFRRR")).toEqual({
      row: 14,
      column: 7,
      seatID: 119,
    });
    expect(parseBoardingPass("BBFFBBFRLL")).toEqual({
      row: 102,
      column: 4,
      seatID: 820,
    });
  });

  it("should get max seatId from input data", () => {
    expect(getMaxSeatId(readFileLines("./input.txt"))).toMatchInlineSnapshot(
      `996`
    );
  });

  it("should find missing seat", () => {
    const boardingPasses = parseBoardingPasses(readFileLines("./input.txt"));
    expect(findEmptySeatId(boardingPasses)).toMatchInlineSnapshot(`671`);
  });
});

function readFileLines(filename: string) {
  return readFileSync(`${__dirname}/${filename}`, "utf-8")
    .split("\n")
    .filter(Boolean);
}
