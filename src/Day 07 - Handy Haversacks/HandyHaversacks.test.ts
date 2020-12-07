import { readFileIntoLines } from "../utils/readFile";

describe("Day 7: Handy Haversacks", () => {
  test("Example - How many bag colors can eventually contain at least one shiny gold bag?", () => {
    const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
    expect(countBagsThatCanContainOneShinyGoldBag(example)).toEqual(4);
  });

  test("Input - How many bag colors can eventually contain at least one shiny gold bag?", () => {
    const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
    expect(
      countBagsThatCanContainOneShinyGoldBag(example)
    ).toMatchInlineSnapshot(`316`);
  });
});

// rule example: vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
type Rules = string[];

function countBagsThatCanContainOneShinyGoldBag(rules: Rules) {
  const bagRules = parseBagRules(rules);
  const shinyGoldIncludedIn = Array.from(
    bagRules.entries()
  ).filter(([_, canContain]) => canContain().includes("shiny gold"));

  return shinyGoldIncludedIn.length;
}

// Examples:
// - faded blue bags contain no other bags.
// - dark olive bags contain 3 faded blue bags, 4 dotted black bags.
function parseRule(ruleStr: string) {
  const [bagDescription, bagContainmentStr] = ruleStr.split("contain");
  const color = bagDescription.replace("bags", "").trim();
  const canContain = bagContainmentStr.includes("no other bags")
    ? []
    : bagContainmentStr.split(",").map((str) => {
        const [countStr, colorA, colorB] = str.trim().split(" "); // example: 99 dotted black bags
        return {
          count: Number(countStr),
          color: `${colorA} ${colorB}`,
        };
      });

  return {
    color,
    canContain,
  };
}

type Color = string;
type CanContain = string[];
type ParsedBagRules = Map<Color, () => CanContain>;

function parseBagRules(rulesAsStrings: Rules): ParsedBagRules {
  const bagRules: ParsedBagRules = new Map();

  for (const ruleStr of rulesAsStrings) {
    const currentRule = parseRule(ruleStr);
    const containsColors = currentRule.canContain.map((c) => c.color);

    let resolvedContains!: CanContain;

    const getContains = (): CanContain => {
      if (resolvedContains) return resolvedContains;

      resolvedContains = containsColors.reduce<CanContain>((acc, color) => {
        acc.push(color);

        const getSubContainment = bagRules.get(color);
        if (getSubContainment) {
          getSubContainment().forEach((subContainmentColor) =>
            acc.push(subContainmentColor)
          );
        }

        return acc;
      }, []);

      return resolvedContains;
    };

    bagRules.set(currentRule.color, getContains);
  }

  return bagRules;
}
