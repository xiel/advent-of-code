import { readFileIntoLines } from "../utils/readFile";

describe("Day 18", () => {
  describe("Part I", () => {
    test("Example", () => {
      expect(evaluateMathyExpression("1 + 2 * 3 + 4 * 5 + 6")).toEqual(71);
      expect(evaluateMathyExpression("1 + (2 * 3) + (4 * (5 + 6))")).toEqual(
        51
      );
      expect(evaluateMathyExpression("2 * 3 + (4 * 5)")).toEqual(26);
      expect(evaluateMathyExpression("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toEqual(
        437
      );
      expect(
        evaluateMathyExpression("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")
      ).toEqual(12240);
      expect(
        evaluateMathyExpression(
          "0 + ((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + (2 + 4) * 2"
        )
      ).toEqual(13632);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(calcSum(input)).toMatchInlineSnapshot(`4940631886147`);
    });
  });

  describe("Part II - Addition First", () => {
    test("Example", () => {
      expect(evaluateMathyExpression("1 + 2 * 3 + 4 * 5 + 6", true)).toEqual(
        231
      );
      expect(
        evaluateMathyExpression("1 + (2 * 3) + (4 * (5 + 6))", true)
      ).toEqual(51);
      expect(evaluateMathyExpression("2 * 3 + (4 * 5)", true)).toEqual(46);
      expect(
        evaluateMathyExpression("5 + (8 * 3 + 9 + 3 * 4 * 3)", true)
      ).toEqual(1445);
      expect(
        evaluateMathyExpression(
          "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))",
          true
        )
      ).toEqual(669060);
      expect(
        evaluateMathyExpression(
          "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + (2 + 4) * 2",
          true
        )
      ).toEqual(23340);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(calcSum(input, true)).toMatchInlineSnapshot(`283582817678281`);
    });
  });
});

function calcSum(expessions: string[], additionFirst = false): number {
  return expessions.reduce(
    (acc, exp) => acc + evaluateMathyExpression(exp, additionFirst),
    0
  );
}

function findGroups(exp: string) {
  const inParensMatches: string[] = [];
  let inParensStr = "";
  let inParensLevel = 0;

  for (const letter of exp) {
    if (letter === "(") {
      inParensLevel++;
    }
    if (inParensLevel) {
      inParensStr += letter;
    }
    if (letter === ")") {
      inParensLevel--;

      if (inParensLevel === 0) {
        inParensMatches.push(inParensStr);
        inParensStr = "";
      }
    }
  }
  return inParensMatches;
}

function removeWrappingParens(exp: string) {
  return exp.replace(/^\(/, "").replace(/\)$/, "");
}

function evaluateMathyExpression(
  expression: string,
  additionFirst = false
): number {
  const trimmedExp = expression.replace(/\s/g, "");

  function resolveExpression(exp: string): number {
    const parensGroups = findGroups(exp);
    const evalExp = additionFirst ? evalStrAdditionFirst : evalStr;

    if (parensGroups.length) {
      return evalExp(
        parensGroups.reduce(
          (acc, parsensGroup) =>
            acc.replace(
              parsensGroup,
              "" + resolveExpression(removeWrappingParens(parsensGroup))
            ),
          exp
        )
      );
    } else {
      return evalExp(exp);
    }
  }

  return resolveExpression(trimmedExp);

  function evalStr(groupExp: string): number {
    const operators = groupExp.match(/[+*]/g) || [];
    const numbers = groupExp.split(/[+*]/g).map((n) => parseFloat(n));
    let value = NaN;

    while (numbers.length) {
      const currentOperator = operators.shift()!;
      const currentValue = isNaN(value) ? numbers.shift()! : value;

      // if first number is NaN (meaning the operator connects to the prev expression)
      if (isNaN(currentValue)) throw Error("no currentValue");

      const nextNum = numbers.shift();

      // if last number is NaN (meaning the operator connects to the next expression)
      if (nextNum === undefined || isNaN(nextNum)) throw Error("no next num");

      value = applyOperator(currentOperator, currentValue, nextNum);
    }

    return value;
  }

  function applyOperator(operator: string, num1: number, num2: number) {
    switch (operator) {
      case "+":
        return num1 + num2;
      case "*":
        return num1 * num2;
      default:
        throw Error("unsupported operator");
    }
  }

  function evalStrAdditionFirst(groupExp: string): number {
    const operators = groupExp.match(/[+*]/g) || [];
    const numbers = groupExp.split(/[+*]/g).map((n) => parseFloat(n));

    while (operators.length) {
      let operatorIndex = operators.indexOf("+");

      if (operatorIndex < 0) {
        operatorIndex = 0;
      }

      const operator = operators[operatorIndex];
      const num1 = numbers[operatorIndex];
      const num2 = numbers[operatorIndex + 1];

      operators.splice(operatorIndex, 1);
      numbers.splice(operatorIndex, 2, applyOperator(operator, num1, num2));
    }

    return numbers[0];
  }
}
