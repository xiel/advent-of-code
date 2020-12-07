import { readFileIntoLines } from "../utils/readFile";

describe("Day 8: XYZ", () => {
  describe("Immediately before any instruction is executed a second time, what value is in the accumulator?", () => {
    test("Example", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(accValueOfAccBeforeLoop(example)).toEqual(5);
    });

    test("Input", () => {
      const example = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(accValueOfAccBeforeLoop(example)).toMatchInlineSnapshot(`1331`);
    });
  });
});

function accValueOfAccBeforeLoop(instructions: string[]) {
  const visited = new Set();
  let latestAccBeforeRepeat = 0;

  run(instructions, ({ currentIndex, acc }) => {
    if (visited.has(currentIndex)) {
      return false;
    }
    visited.add(currentIndex);
    latestAccBeforeRepeat = acc;
  });

  return latestAccBeforeRepeat;
}

function run(
  instructions: string[],
  onTick: (state: { currentIndex: number; acc: number }) => void | false
) {
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
        break;
      }
    }
  }

  return acc;
}
