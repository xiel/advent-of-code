import { readFileIntoLines } from "../../utils/readFile";

describe("Day 8: Handheld Halting", () => {
  describe("Immediately before any instruction is executed a second time, what value is in the accumulator?", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(runWithLoopProtection(example).accBeforeLoop).toEqual(5);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(
        runWithLoopProtection(example).accBeforeLoop
      ).toMatchInlineSnapshot(`1331`);
    });
  });

  describe("Fix Program - What is the value of the accumulator after the program terminates?", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(fixBootCodeInstructions(example)).toEqual(8);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(fixBootCodeInstructions(example)).toMatchInlineSnapshot(`1121`);
    });
  });
});

function runWithLoopProtection(instructions: string[]) {
  const visited = new Set();
  let accBeforeLoop = 0;

  const result = run(instructions, ({ currentIndex, acc }) => {
    if (visited.has(currentIndex)) {
      return false;
    }
    visited.add(currentIndex);
    accBeforeLoop = acc;
  });

  return {
    result,
    accBeforeLoop,
  };
}

function replaceOperationAtIndex(
  instructions: string[],
  index: number,
  newOp: string
) {
  const [, arg] = instructions[index].split(" ");
  const newInstructions = [...instructions];
  newInstructions[index] = `${newOp} ${arg}`;
  return newInstructions;
}

function fixBootCodeInstructions(instructions: string[]): number {
  let replaceAtIndex = 0;

  while (replaceAtIndex < instructions.length) {
    const [op] = instructions[replaceAtIndex].split(" ");

    // Somewhere in the program, either a jmp is supposed to be a nop, or a nop is supposed to be a jmp.
    if (op !== "jmp" && op !== "nop") {
      replaceAtIndex++;
      continue;
    }

    const fixedInstructions = replaceOperationAtIndex(
      instructions,
      replaceAtIndex,
      op === "jmp" ? "nop" : "jmp"
    );
    const state = runWithLoopProtection(fixedInstructions);

    // when we get an actual result, the program terminated correctly
    if (state.result !== undefined) {
      console.info(`Instruction at Index ${replaceAtIndex} was fixed`, {
        from: instructions[replaceAtIndex],
        to: fixedInstructions[replaceAtIndex],
      });

      return state.result;
    }

    replaceAtIndex++;
  }

  throw Error("unable to fix program");
}

function run(
  instructions: string[],
  onTick: (state: { currentIndex: number; acc: number }) => void | false
): number | undefined {
  let currentIndex = 0;
  let acc = 0;

  while (currentIndex < instructions.length) {
    const [op, arg] = instructions[currentIndex].split(" ");

    switch (op) {
      case "nop":
        currentIndex++;
        break;
      case "acc":
        acc += Number(arg);
        currentIndex++;
        break;
      case "jmp":
        currentIndex += Number(arg);
        break;
    }

    if (onTick) {
      const proceed = onTick({ currentIndex, acc });

      if (proceed === false) {
        return;
      }
    }
  }

  return acc;
}
