type Op = "inp" | "add" | "mul" | "div" | "mod" | "eql";
type Var = "w" | "x" | "y" | "z";
type Inst = [Op, Var, Var | number];
const { min, max, floor } = Math;

export function solveDay24(lines: string[]) {
  const instructions = lines.map((l) => l.split(" ") as Inst);
  const parameters: number[][] = [];

  for (let j = 0; j < 14; j++) {
    const args = [];
    for (const i of [4, 5, 15]) {
      const k = i + j * 18;
      args.push(+instructions[k][2]);
    }
    parameters.push(args);
  }

  const values = findConstrainedValues();
  const valuesAsNumbers = values.map((v) => +v.join(""));

  valuesAsNumbers.forEach((v) => {
    const result = run(`${v}`);
    if (result.z !== 0) {
      throw Error("incorrect value.");
    }
  });

  return {
    max: max(...valuesAsNumbers),
    min: min(...valuesAsNumbers),
  };

  function run(inputChars: string) {
    let inputCursor = 0;
    const vars = {
      w: 0,
      x: 0,
      y: 0,
      z: 0,
    };

    for (const inst of instructions) {
      const [op, a, b] = inst;
      const aValue = a in vars ? vars[a] : +a;
      const bValue = typeof b === "string" && b in vars ? vars[b] : +b;

      switch (op) {
        case "inp":
          vars[a] = +inputChars[inputCursor++];
          if (Number.isNaN(vars[a])) throw Error("input invalid.");
          break;
        case "add":
          vars[a] = aValue + bValue;
          break;
        case "mul":
          vars[a] = aValue * bValue;
          break;
        case "div":
          vars[a] = floor(aValue / bValue);
          break;
        case "mod":
          vars[a] = aValue % bValue;
          break;
        case "eql":
          vars[a] = aValue === bValue ? 1 : 0;
          break;
        default:
          throw Error("op unknown.");
      }
    }

    return vars;
  }

  function findConstrainedValues() {
    const deps = [0];
    const constraints = Array.from<number>({ length: 15 });

    for (let i = 1; i <= parameters.length; i++) {
      const p = parameters[i - 1];
      if (p[0] == 1) {
        deps.push(i);
      } else {
        constraints[i] = deps[deps.length - 1];
        deps.pop();
      }
    }

    const maxValues = Array.from<number>({ length: 15 });
    const minValues = Array.from<number>({ length: 15 });

    for (const [i, constraint] of constraints.entries()) {
      if (constraint === undefined) continue;
      maxValues[constraint] = Math.min(
        9,
        9 - parameters[constraint - 1][2] - parameters[i - 1][1]
      );

      const sum = parameters[constraint - 1][2] + parameters[i - 1][1];
      minValues[constraint] = Math.max(1 - sum, 1);
    }

    const maxAttempt = [];
    const minAttempt = [];

    for (let i = 1; i < maxValues.length; i++) {
      maxAttempt.push(maxValues[i]);
      minAttempt.push(minValues[i]);
    }

    for (const [i, constraint] of constraints.entries()) {
      if (constraint === undefined) continue;
      maxAttempt[i - 1] =
        maxAttempt[constraint - 1] +
        parameters[constraint - 1][2] +
        parameters[i - 1][1];
      minAttempt[i - 1] =
        minAttempt[constraint - 1] +
        parameters[constraint - 1][2] +
        parameters[i - 1][1];
    }

    return [maxAttempt, minAttempt];
  }
}
