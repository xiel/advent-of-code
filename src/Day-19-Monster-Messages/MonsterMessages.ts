export function parseRulesAndMessages(
  groups: string[],
  updateRules?: (rules: string[]) => string[]
) {
  const messages = groups[1].split("\n").filter(Boolean);
  let rules = groups[0].split("\n").filter(Boolean);
  const ruleMap: RuleMap = new Map();
  const resultMap = new Map<string, string[]>();

  init();

  return {
    ruleMap,
    messages,
  };

  function init() {
    // this this for part two
    rules = updateRules ? updateRules(rules) : rules;

    rules.forEach((ruleStr) => {
      const [ruleIndexStr, ruleValue] = ruleStr.split(": ");
      const ruleIndex = Number(ruleIndexStr);
      const subRuleOptions = ruleValue
        .split(" | ")
        .map((o) => o.split(" ").map((n) => parseInt(n)));

      const charValue = ruleValue.includes('"')
        ? unquote(ruleValue.trim())
        : undefined;

      if (charValue) {
        ruleMap.set(ruleIndex, matchCharRule);
      } else {
        ruleMap.set(ruleIndex, matchRule);
      }

      function matchRule(str: string): string[] {
        const key = `${ruleIndex}-` + str;

        if (resultMap.has(key)) {
          return resultMap.get(key)!;
        }

        const matches = subRuleOptions.flatMap((ruleIdSequence) => {
          let matchables: { matched: string; rest: string }[] = [
            { matched: "", rest: str },
          ];

          for (const ruleId of ruleIdSequence) {
            matchables = matchables.flatMap(({ matched, rest }) => {
              return getRule(ruleId)(rest).map((matchedPart) => ({
                matched: matched + matchedPart,
                rest: removeMatchedPart(rest, matchedPart),
              }));
            });
          }

          return matchables.map((m) => m.matched);
        });

        resultMap.set(key, matches);

        return matches;
      }

      function matchCharRule(str: string): string[] {
        if (!charValue) throw Error("charValue missing");
        return str.startsWith(charValue) ? [charValue] : [];
      }
    });
  }

  function getRule(i: number) {
    return ruleMap.get(i)!;
  }

  function removeMatchedPart(str: string, usedStr: string) {
    return str.replace(usedStr, "");
  }
}

type RuleMap = Map<number, MatchRule>;
type MatchRule = (str: string) => string[];

// How many messages completely match rule 0
export function countMessagesMatchingRule({
  messages,
  ruleMap,
}: {
  messages: string[];
  ruleMap: RuleMap;
  rule?: number;
}) {
  const matchRuleZerro = ruleMap.get(0)!;
  const validMessages = messages.filter((m) => matchRuleZerro(m).includes(m));
  return validMessages.length;
}

function unquote(str: string) {
  return str.replace(/^"/, "").replace(/"$/, "");
}
