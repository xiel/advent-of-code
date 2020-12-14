import { readFileIntoLines } from "../utils/readFile";

describe("Day 14 - Docking Data", () => {
  describe("Part I - What is the sum of all values left in memory after it completes?", () => {
    test("Example", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      expect(
        applyMask(
          "000000000000000000000000000000001011",
          "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"
        )
      ).toEqual("000000000000000000000000000001001001");

      expect(
        applyMask(
          "000000000000000000000000000001100101",
          "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"
        )
      ).toEqual("000000000000000000000000000001100101");
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(runDockingProgram(input)).toEqual(9967721333886);
    });
  });
});

// mask example: XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
function applyMask(value: string, mask: string) {
  const newValue = value.padStart(mask.length, "0").split("");
  mask.split("").forEach((letter, i) => {
    if (letter === "1") {
      newValue[i] = "1";
    } else if (letter === "0") {
      newValue[i] = "0";
    }
  });
  return newValue.join("");
}

function runDockingProgram(instructionsStrs: string[]) {
  const memory = new Map<number, number>();
  let currentMask = "";

  for (const instr of instructionsStrs) {
    const [assignee, valueStr] = instr.split(" = ");

    if (assignee === "mask") {
      currentMask = valueStr;
      continue;
    }

    if (assignee.startsWith("mem[")) {
      const valueNum = parseInt(valueStr, 10);
      const address = parseInt(assignee.match(/\d+/)![0], 10);
      const value = applyMask(valueNum.toString(2), currentMask);
      memory.set(address, parseInt(value, 2));
    }
  }

  return Array.from(memory.values()).reduce((a, b) => a + b, 0);
}
