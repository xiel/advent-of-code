import { readFileIntoGroups } from "../utils/readFile";
import {
  countMessagesMatchingRule,
  parseRulesAndMessages,
} from "./MonsterMessages";

const simpleExample = `
0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"

aab
aba
aaa
aaba
ccc
`;

describe("Day 19", () => {
  describe("Part I", () => {
    test("Simple Example", () => {
      expect(
        countMessagesMatchingRule(
          parseRulesAndMessages(simpleExample.split("\n\n").filter(Boolean))
        )
      ).toEqual(2);
    });

    test("Example", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/example.txt`);
      expect(countMessagesMatchingRule(parseRulesAndMessages(input))).toEqual(
        2
      );
    });

    test("Input", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/input.txt`);
      expect(countMessagesMatchingRule(parseRulesAndMessages(input))).toEqual(
        122
      );
    });
  });

  describe("Part II", () => {
    test("Example", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/example2.txt`);
      expect(countMessagesMatchingRule(parseRulesAndMessages(input))).toEqual(
        3
      );
    });

    const updateRules = (rules: string[]) =>
      rules.map((rule) => {
        if (rule.startsWith("8: ")) {
          return "8: 42 | 42 8";
        }
        if (rule.startsWith("11: ")) {
          return "11: 42 31 | 42 11 31";
        }
        return rule;
      });

    test("Example (Updated Rules)", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/example2.txt`);
      expect(
        countMessagesMatchingRule(parseRulesAndMessages(input, updateRules))
      ).toEqual(12);
    });

    test.skip("Input", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/input.txt`);
      expect(
        countMessagesMatchingRule(parseRulesAndMessages(input, updateRules))
      ).toEqual(0);
    });
  });
});
