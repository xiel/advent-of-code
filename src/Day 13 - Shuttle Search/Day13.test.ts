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
});

// time(stamps) are in minutes
function findNextBus(earliestTimestampStr: string, possibleBusIdsStr: string) {
  const earliestTimestamp = Number(earliestTimestampStr);
  const busIds = possibleBusIdsStr
    .split(",")
    .map((idStr) => Number(idStr))
    .filter((id) => !isNaN(id));

  console.log(`earliestTimestamp`, earliestTimestamp);
  console.log(`busIds`, busIds);

  const waitTimes = busIds
    .map((busId) => {
      const waitTime = busId - (earliestTimestamp % busId);
      return {
        busId,
        waitTime,
      };
    })
    .sort((a, b) => a.waitTime - b.waitTime);

  console.log(`waitTimes`, waitTimes);

  const { busId, waitTime } = waitTimes[0];

  return {
    busId,
    waitTime,
  };
}
