import { readFileIntoLines } from "../../utils/readFile";

// Fuel required to launch a given module is based on its mass. Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.
function calcFuelRequirement(
  mass: string | number,
  includeFuelForFuel = false
): number {
  const flooredThird = Math.floor(Number(mass) / 3);

  if (flooredThird <= 2) return 0;

  const requiredFullMass = flooredThird - 2;
  return (
    requiredFullMass +
    (includeFuelForFuel
      ? calcFuelRequirement(requiredFullMass, includeFuelForFuel)
      : 0)
  );
}

function getFuelRequirementSum(
  moduleMassStrings: string[],
  includeFuelForFuel = false
) {
  return moduleMassStrings.reduce(
    (sum, moduleMassString) =>
      sum + calcFuelRequirement(moduleMassString, includeFuelForFuel),
    0
  );
}

describe("Fuel Requirements", () => {
  it("should work on examples", () => {
    expect(calcFuelRequirement("12")).toEqual(2);
    expect(calcFuelRequirement("14")).toEqual(2);
    expect(calcFuelRequirement("1969")).toEqual(654);
    expect(calcFuelRequirement("100756")).toEqual(33583);
  });

  it("should calc sum of Fuel Requirements (input) - Part I", () => {
    expect(
      getFuelRequirementSum(readFileIntoLines(`${__dirname}/input.txt`))
    ).toMatchInlineSnapshot(`3392373`);
  });

  it("account the mass of the added fuel (examples)", function () {
    expect(calcFuelRequirement("12", true)).toEqual(2);
    expect(calcFuelRequirement("14", true)).toEqual(2);
    expect(calcFuelRequirement("1969", true)).toEqual(966);
    expect(calcFuelRequirement("100756", true)).toEqual(50346);
  });

  it("account the mass of the added fuel (input) - Part II", () => {
    expect(
      getFuelRequirementSum(readFileIntoLines(`${__dirname}/input.txt`), true)
    ).toMatchInlineSnapshot(`5085699`);
  });
});
