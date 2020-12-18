export function calcSum(
  expressions: string[],
  ruleAdditionFirst = false
): number {
  return expressions.reduce(
    (acc, exp) => acc + evaluateMathyExpression(exp, ruleAdditionFirst),
    0
  );
}

export function evaluateMathyExpression(
  expression: string,
  ruleAdditionFirst = false
): number {
  // start with white spaces removed
  return resolveExpression(expression.replace(/\s/g, ""));

  // func will call itself recursively until all parenthesis are evaluated
  function resolveExpression(exp: string): number {
    const parensGroups = findExpressionsInParens(exp);

    if (parensGroups.length) {
      return evalExp(
        parensGroups.reduce((acc, expInParens) => {
          const resolvedExpInParens = resolveExpression(unwrap(expInParens));

          return acc.replace(expInParens, resolvedExpInParens.toString());
        }, exp)
      );
    } else {
      return evalExp(exp);
    }
  }

  function findExpressionsInParens(exp: string) {
    const inParensMatches: string[] = [];
    let inParensStr = "";
    let inParensLevel = 0;

    for (const char of exp) {
      if (char === "(") {
        inParensLevel++;
      }
      if (inParensLevel) {
        inParensStr += char;
      }
      if (char === ")") {
        inParensLevel--;

        if (inParensLevel === 0) {
          inParensMatches.push(inParensStr);
          inParensStr = "";
        }
      }
    }
    return inParensMatches;
  }

  function evalExp(groupExp: string): number {
    const operators = groupExp.match(/[+*]/g) || [];
    const numbers = groupExp.split(/[+*]/g).map((n) => parseFloat(n));

    while (operators.length) {
      let operatorIndex = ruleAdditionFirst ? operators.indexOf("+") : -1;

      if (operatorIndex < 0) {
        operatorIndex = 0;
      }

      const operator = operators[operatorIndex];
      const num1 = numbers[operatorIndex];
      const num2 = numbers[operatorIndex + 1];

      // remove used operator
      operators.splice(operatorIndex, 1);

      // replace used nums with the result
      numbers.splice(operatorIndex, 2, applyOperator(operator, num1, num2));
    }

    return numbers[0];
  }

  function unwrap(exp: string) {
    return exp.replace(/^\(/, "").replace(/\)$/, "");
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
}
