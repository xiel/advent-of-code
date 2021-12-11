import { readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/3
describe("Day 3: Binary Diagnostic", () => {
  test("01", () => {
    const lines = readFileIntoLines(__dirname + "/input.txt");
    const splitted = lines.map((l) => l.split(""));

    let gammaRate = "";
    let epsilonRate = "";

    for (let i = 0; i < splitted[0].length; i++) {
      const average =
        splitted.map((r) => parseInt(r[i])).reduce((a, b) => a + b, 0) /
        splitted.length;

      if (average > 0.5) {
        gammaRate += "1";
        epsilonRate += "0";
      } else {
        gammaRate += "0";
        epsilonRate += "1";
      }
    }

    const powerConsumption = parseInt(epsilonRate, 2) * parseInt(gammaRate, 2);
    expect(powerConsumption).toEqual(2724524);
  });

  test("02", () => {
    const lines = readFileIntoLines(__dirname + "/input.txt");
    const splitted = lines.map((l) => l.split(""));
    const oxygenGeneratorRating = findRating(splitted, 0, true);
    const co2scrubberRating = findRating(splitted, 0, false);
    const lifeSupportRating =
      parseInt(oxygenGeneratorRating, 2) * parseInt(co2scrubberRating, 2);

    expect(lifeSupportRating).toEqual(2775870);
  });
});

function findRating(readings: string[][], i = 0, takeCommon = true): string {
  const average =
    readings.map((r) => parseInt(r[i])).reduce((a, b) => a + b, 0) /
    readings.length;

  const atCursor = takeCommon
    ? average >= 0.5
      ? "1"
      : "0"
    : average >= 0.5
    ? "0"
    : "1";

  const filteredRemaining = readings.filter((r) => r[i] === atCursor);

  if (filteredRemaining.length <= 1) {
    return filteredRemaining[0].join("");
  } else {
    return findRating(filteredRemaining, i + 1, takeCommon);
  }
}
