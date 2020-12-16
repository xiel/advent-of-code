import { readFileSync } from "fs";

const example = `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`;

describe("Day 16", () => {
  describe("Part I - What is your ticket scanning error rate?", () => {
    test("Example", () => {
      expect(scanningErrorRate(example)).toEqual(71);
    });

    test("Input", () => {
      const input = readFileSync(`${__dirname}/fixtures/input.txt`, "utf-8");
      expect(scanningErrorRate(input)).toEqual(21996);
    });
  });

  describe("Part II - Departure. What do you get if you multiply those six values together?", () => {
    test("Example", () => {
      // ...
    });

    test("Input", () => {
      // ...
    });
  });
});

type Range = [number, number];

function parseTicketInfos(input: string) {
  const [rulesStr, _myTicketStr, nearbyTicketsStr] = input
    .split("\n\n")
    .map((group) =>
      group
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    );

  const validRanges = new Map<string, Range[]>();

  rulesStr.forEach((rule) => {
    const [label, rangesStr] = rule.split(": ");
    const ranges = rangesStr.split(" or ").map((rangeStr) =>
      rangeStr
        .trim()
        .split("-")
        .map((n) => Number(n))
    ) as Range[];

    validRanges.set(label, ranges);
  });

  const nearbyTickets = nearbyTicketsStr
    .slice(1)
    .map((ticketNumStr) => ticketNumStr.split(",").map((n) => Number(n)));

  return {
    validRanges,
    nearbyTickets,
  };
}

function inRange([min, max]: Range, num: number) {
  return min <= num && max >= num;
}

function inRanges(ranges: Range[], num: number) {
  return ranges.find((range) => inRange(range, num)) !== undefined;
}

function scanningErrorRate(input: string) {
  const { validRanges, nearbyTickets } = parseTicketInfos(input);
  const validRangesEntries = [...validRanges.entries()];
  const inValidValues: number[] = [];

  nearbyTickets.forEach((values) => {
    values.forEach((value) => {
      if (!validRangesEntries.find(([_, ranges]) => inRanges(ranges, value))) {
        inValidValues.push(value);
      }
    });
  });

  return inValidValues.reduce((a, b) => a + b, 0);
}
