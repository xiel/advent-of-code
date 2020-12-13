import { readFileIntoLines } from "../utils/readFile";

describe("Day 13 - Shuttle Search", () => {
  // Figure out where the navigation instructions lead. What is the Manhattan distance between that location and the ship's starting position?
  describe("Part I - What is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus?", () => {
    test("Example", () => {
      const example = ["939", "7,13,x,x,59,x,31,19"];
      const { busId, waitTime } = findNextBus(example[0], example[1]);
      expect(busId).toEqual(59);
      expect(waitTime).toEqual(5);
      expect(busId * waitTime).toEqual(295);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const { busId, waitTime } = findNextBus(input[0], input[1]);
      expect(busId).toMatchInlineSnapshot(`23`);
      expect(waitTime).toMatchInlineSnapshot(`6`);
      expect(busId * waitTime).toMatchInlineSnapshot(`138`);
    });
  });

  describe("Part II - What is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list?", () => {
    test("Example", () => {
      expect(findEarliestTsForOffsetDepartures("7,13,x,x,59,x,31,19")).toEqual(
        1068781
      );
      expect(findEarliestTsForOffsetDepartures("17,x,13,19")).toEqual(3417);
      expect(findEarliestTsForOffsetDepartures("67,7,59,61")).toEqual(754018);
      expect(findEarliestTsForOffsetDepartures("67,x,7,59,61")).toEqual(779210);
      expect(findEarliestTsForOffsetDepartures("67,7,x,59,61")).toEqual(
        1261476
      );
      expect(findEarliestTsForOffsetDepartures("1789,37,47,1889")).toEqual(
        1202161486
      );
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(findEarliestTsForOffsetDepartures(input[1])).toMatchInlineSnapshot(
        `226845233210288`
      );
    });
  });
});

// time(stamps) are in minutes
function findNextBus(earliestTimestampStr: string, possibleBusIdsStr: string) {
  const earliestTimestamp = Number(earliestTimestampStr);
  const busIds = possibleBusIdsStr
    .split(",")
    .map((idStr) => Number(idStr))
    .filter((id) => !isNaN(id));

  const waitTimes = busIds
    .map((busId) => {
      const waitTime = busId - (earliestTimestamp % busId);
      return {
        busId,
        waitTime,
      };
    })
    .sort((a, b) => a.waitTime - b.waitTime);

  const { busId, waitTime } = waitTimes[0];

  return {
    busId,
    waitTime,
  };
}

function findEarliestTsForOffsetDepartures(possibleBusIdsStr: string) {
  const busIds = possibleBusIdsStr.split(",").map((idStr, offset) => {
    const busId = Number(idStr);
    if (isNaN(busId)) return 1;
    return busId;
  });

  let incrementer = busIds[0]!;
  let currentIndex = 1;
  let currentTime = incrementer;

  while (currentIndex < busIds.length) {
    if ((currentTime + currentIndex) % busIds[currentIndex] == 0) {
      incrementer *= busIds[currentIndex];
      currentIndex += 1;
    } else {
      currentTime += incrementer;
    }
  }

  return currentTime;
}
