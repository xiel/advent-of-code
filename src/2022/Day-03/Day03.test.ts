import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

const example = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

// https://adventofcode.com/2022/day/3
describe("Day 03", () => {
  test("Example", () => {
    expect(solve(readExampleIntoLines(example))).toEqual({
      prioSum: 157,
      group3PrioSum: 70,
    });
  });

  test("Part 1 & 2", () => {
    expect(solve(readFileIntoLines(__dirname + "/input.txt"))).toEqual({
      prioSum: 8515,
      group3PrioSum: 2434,
    });
  });
});

const getPrio = (() => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const prioMap = (alphabet + alphabet.toUpperCase()).split("");
  return (letter: string) => prioMap.indexOf(letter) + 1;
})();

function solve(str: string[]) {
  const rucksacksAsCompartments = str.map((s) => [
    s.substring(0, s.length / 2),
    s.substring(s.length / 2),
  ]);

  const prioSum = rucksacksAsCompartments.reduce((acc, [compA, compB]) => {
    const setB = new Set(compB);
    const sharedTypes = new Set(Array.from(compA).filter((l) => setB.has(l)));
    const prio = [...sharedTypes].reduce((a, letter) => a + getPrio(letter), 0);
    return acc + prio;
  }, 0);

  const groupsOfThree = str.reduce((acc, rucksackStr, i) => {
    const groupIndex = Math.floor(i / 3);
    const group = acc[groupIndex] ?? (acc[groupIndex] = [] as never);
    group.push(rucksackStr);
    return acc;
  }, [] as [string, string, string][]);

  const group3PrioSum = groupsOfThree.reduce((acc, group3) => {
    const [a, b, c] = group3;
    const [bSet, cSet] = [new Set(b), new Set(c)];
    const sharedLetters = new Set(
      Array.from(a).filter((l) => bSet.has(l) && cSet.has(l))
    );
    const prio = [...sharedLetters].reduce(
      (a, letter) => a + getPrio(letter),
      0
    );

    return acc + prio;
  }, 0);

  return {
    prioSum,
    group3PrioSum,
  };
}
