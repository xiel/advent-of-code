import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

describe("Day 14", () => {
  const example = readExampleIntoLines(`
    NNCB

    CH -> B
    HH -> N
    CB -> H
    NH -> C
    HB -> C
    HC -> B
    HN -> C
    NN -> C
    BH -> H
    NC -> B
    NB -> B
    BN -> B
    BB -> N
    BC -> B
    CC -> N
    CN -> C
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  // What do you get if you take the quantity of the most common element and subtract the quantity of the least common element? (weirdSum)
  test("Part 1 & 2", () => {
    solve(example, (step, n) => {
      if (step === 5) expect(n.length).toBe(97);
      if (step === 10) expect(n.length).toBe(3073);
      if (step === 10) expect(n.weirdSum).toBe(1588);
      if (step === 40) expect(n.weirdSum).toBe(2188189693529);
      if (step === 40) return true;
    });

    solve(input, (step, n) => {
      if (step === 10) expect(n.weirdSum).toBe(2170);
      if (step === 40) expect(n.weirdSum).toBe(2422444761283);
      if (step === 40) return true;
    });
  });
});

interface MetaData {
  length: number;
  weirdSum: number;
}

function solve(
  lines: string[],
  onDay: (step: number, n: MetaData) => void | true,
  maxDays = 200
) {
  const [polymerTemplate, ...pairInsertionRulesStrs] = lines;
  const pairInsertionRules = pairInsertionRulesStrs.map((s) => s.split(" -> "));

  const elementCounts = new Map<string, number>();
  const pairCounts = new Map<string, number>();

  // Create & seed element counters
  polymerTemplate.split("").forEach((element) => {
    elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
  });

  // Create a counter for each pair of interest (pairs with rules)
  pairInsertionRules.forEach(([pair, insertElement]) => {
    const initialPairCount = Array.from(
      polymerTemplate.matchAll(new RegExp(pair, "g"))
    ).length;

    pairCounts.set(pair, initialPairCount);

    // Also add counter for elements that were not in the initial template, but can be added by insertion rules
    if (!elementCounts.has(insertElement)) {
      elementCounts.set(insertElement, 0);
    }
  });

  let stepCount = 0;

  while (stepCount < maxDays) {
    stepCount++;

    // Execute all pair insertion rules and collect changes made to the number of pairs (diffs)
    // Pair counters may not interfere with each other in the same step
    const pairChanges: [string, number][] = [];

    pairInsertionRules.forEach(([pair, insertElement]) => {
      const pairExistsTimes = pairCounts.get(pair)!;

      if (!pairExistsTimes) return;

      // Update the counter for the inserted element
      const elCounter = elementCounts.get(insertElement)!;
      elementCounts.set(insertElement, elCounter + pairExistsTimes);

      // Currently existing pairs are destroyed by inserting a element in the middle
      pairChanges.push([pair, -pairExistsTimes]);

      // Two new pairs are created in the front & back for each existing pair
      const [front, back] = pair;
      const [newPairFront, newPairBack] = [
        front + insertElement,
        insertElement + back,
      ];
      pairChanges.push([newPairFront, pairExistsTimes]);
      pairChanges.push([newPairBack, pairExistsTimes]);
    });

    pairChanges.forEach(([pair, valueChange]) => {
      pairCounts.set(pair, pairCounts.get(pair)! + valueChange);
    });

    if (onDay(stepCount, getMetaData())) break;
  }

  function getMetaData() {
    const length = [...elementCounts.values()].reduce((a, b) => a + b, 0);
    const valuesSorted = [...elementCounts.values()].sort((a, b) => b - a);
    const weirdSum = valuesSorted[0] - valuesSorted[valuesSorted.length - 1];

    return {
      length,
      weirdSum,
    };
  }
}
