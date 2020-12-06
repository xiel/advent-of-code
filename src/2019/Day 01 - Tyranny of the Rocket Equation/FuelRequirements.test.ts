import { readFileIntoLines } from "../../utils/readFile";

// Fuel required to launch a given module is based on its mass. Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.
function calcFuelRequirement(moduleMassString: string) {
  return Math.floor(Number(moduleMassString) / 3) - 2;
}

function getFuelRequirementSum(moduleMassStrings: string[]) {
  return moduleMassStrings.reduce(
    (sum, moduleMassString) => sum + calcFuelRequirement(moduleMassString),
    0
  );
}

describe("Fuel Requirements", () => {
  it("should work on examples", () => {
    expect(calcFuelRequirement("12")).toEqual(2);
    expect(calcFuelRequirement("14")).toEqual(2);
    expect(calcFuelRequirement("1969")).toEqual(654);
  });

  it("should calc sum of input - part I", () => {
    expect(
      getFuelRequirementSum(readFileIntoLines(`${__dirname}/input.txt`))
    ).toMatchInlineSnapshot(`3392373`);
  });
});
