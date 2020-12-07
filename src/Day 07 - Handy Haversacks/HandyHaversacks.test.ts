import { readFileIntoLines } from "../utils/readFile";

describe("Day 7: Handy Haversacks", () => {
  describe("How many bag colors can eventually contain at least one shiny gold bag?", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(countBagsThatCanContainOneShinyGoldBag(example)).toEqual(4);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(
        countBagsThatCanContainOneShinyGoldBag(example)
      ).toMatchInlineSnapshot(`316`);
    });
  });
});

describe("Day 7: Handy Haversacks - Part II", () => {
  describe("How many individual bags are required inside your single shiny gold bag?", () => {
    test("Example", () => {
      const example = readFileIntoLines(
        `${__dirname}/fixtures/examplePart2.txt`
      );
      expect(countBagsInShinyGoldBag(example)).toEqual(126);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(countBagsInShinyGoldBag(example)).toMatchInlineSnapshot(`11310`);
    });
  });
});

// rule example: vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
type Rules = string[];
type Color = string;
type Contain = {
  color: string;
  count: number;
};
type MustContain = Contain[];
type ParsedBagRules = Map<Color, () => MustContain>;

function countBagsInShinyGoldBag(rules: Rules) {
  const bagRules = parseBagRules(rules);
  const shinyGoldContains = bagRules.get("shiny gold")?.() || [];
  return shinyGoldContains.reduce((acc, contain) => acc + contain.count, 0);
}

function countBagsThatCanContainOneShinyGoldBag(rules: Rules) {
  const bagRules = parseBagRules(rules);
  const shinyGoldIncludedIn = Array.from(bagRules).filter(([_, canContain]) =>
    canContain().find((contain) => contain.color === "shiny gold")
  );
  return shinyGoldIncludedIn.length;
}

// Examples:
// - faded blue bags contain no other bags.
// - dark olive bags contain 3 faded blue bags, 4 dotted black bags.
function parseRule(ruleStr: string) {
  const [bagDescription, bagContainmentStr] = ruleStr.split("contain");
  const color = bagDescription.replace("bags", "").trim();
  const mustContain: Contain[] = bagContainmentStr.includes("no other bags")
    ? []
    : bagContainmentStr.split(",").map((str) => {
        const [countStr, colorA, colorB] = str.trim().split(" "); // example: 99 dotted black bags
        return {
          color: `${colorA} ${colorB}`,
          count: Number(countStr),
        };
      });

  return {
    color,
    mustContain,
  };
}

function parseBagRules(rulesAsStrings: Rules): ParsedBagRules {
  const bagRules: ParsedBagRules = new Map();

  for (const ruleStr of rulesAsStrings) {
    const currentRule = parseRule(ruleStr);

    // resolve contains dynamically when read for the first time
    // cache result for faster subsequent reads
    let resolvedContains!: MustContain;
    const getContains = (): MustContain => {
      if (resolvedContains) return resolvedContains;

      return (resolvedContains = currentRule.mustContain.reduce<MustContain>(
        (acc, contain) => {
          acc.push(contain);

          const subContains = bagRules.get(contain.color)?.() || [];

          subContains.forEach((subContain) =>
            acc.push({
              color: subContain.color,
              count: subContain.count * contain.count,
            })
          );

          return acc;
        },
        []
      ));
    };

    bagRules.set(currentRule.color, getContains);
  }

  return bagRules;
}
