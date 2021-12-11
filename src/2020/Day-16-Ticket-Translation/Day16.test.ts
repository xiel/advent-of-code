import { readFileSync } from "fs";

describe("Day 16 - Ticket Translation", () => {
  describe("Part I - What is your ticket scanning error rate?", () => {
    test("Example", () => {
      expect(
        scanningErrorRate(
          readFileSync(`${__dirname}/fixtures/example.txt`, "utf-8")
        )
      ).toEqual(71);
    });

    test("Input", () => {
      const input = readFileSync(`${__dirname}/fixtures/input.txt`, "utf-8");
      expect(scanningErrorRate(input)).toEqual(21996);
    });
  });

  describe("Part II - Departure. What do you get if you multiply those six values together?", () => {
    test("Input", () => {
      const input = readFileSync(`${__dirname}/fixtures/input.txt`, "utf-8");
      expect(departureProduct(input)).toEqual(650080463519);
    });
  });
});

type Range = [number, number];

function parseTicketInfos(input: string) {
  const [rulesStr, myTicketStr, nearbyTicketsStr] = input
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

  const myTicket = myTicketStr[1].split(",").map((n) => Number(n));

  return {
    validRanges,
    myTicket,
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
  const validRangesEntries = [...validRanges];
  const inValidValues: number[] = [];

  nearbyTickets.forEach((nearbyTicket) => {
    nearbyTicket.forEach((value) => {
      if (!validRangesEntries.find(([_, ranges]) => inRanges(ranges, value))) {
        inValidValues.push(value);
      }
    });
  });

  return inValidValues.reduce((a, b) => a + b, 0);
}

// part II
function departureProduct(input: string) {
  const { validRanges, nearbyTickets, myTicket } = parseTicketInfos(input);
  const validRangesEntries = [...validRanges];
  const validNearbyTickets = nearbyTickets.filter((nearbyTicket) =>
    nearbyTicket.every((value) =>
      validRangesEntries.find(([_, ranges]) => inRanges(ranges, value))
    )
  );

  const countMatchingTicketsPerField = new Map<string, number[]>();
  const ticketsToCheck = [myTicket, ...validNearbyTickets];

  ticketsToCheck.forEach((ticket) => {
    ticket.forEach((value, index) => {
      validRangesEntries.forEach(([label, ranges]) => {
        if (inRanges(ranges, value)) {
          const current = countMatchingTicketsPerField.get(label) || [];
          current[index] = (current[index] || 0) + 1;
          countMatchingTicketsPerField.set(label, current);
        }
      });
    });
  });

  const validFieldIndexesPerField = [...countMatchingTicketsPerField]
    .map(
      ([fieldName, matchingTicketsCountsPerIndex]) =>
        [
          fieldName,
          matchingTicketsCountsPerIndex
            // index in the array is index in the ticket for which the count is
            .map((count, fieldIndex) => [count, fieldIndex])
            // remove counts, where not all tickets were matched for (value was not in range)
            .filter(([count]) => count === ticketsToCheck.length)
            // only need the indexes from here on
            .map(([, fieldIndex]) => fieldIndex),
        ] as const
    )
    // sort fields so that least possible indexes are on top
    .sort(([, arrA], [, arrB]) => arrA.length - arrB.length);

  const indexesForFields = new Map<string, number>();
  const assignedIndexes = new Set<number>();

  validFieldIndexesPerField.forEach(([label, possibleIndexes]) => {
    const remaining = possibleIndexes.filter((i) => !assignedIndexes.has(i));

    if (remaining.length !== 1)
      throw Error("multiple ways possible: " + remaining.length);

    indexesForFields.set(label, remaining[0]);
    assignedIndexes.add(remaining[0]);
  });

  return [...indexesForFields].reduce((acc, [fieldLabel, fieldIndex]) => {
    if (!fieldLabel.startsWith("departure")) return acc;
    return acc * myTicket[fieldIndex];
  }, 1);
}
