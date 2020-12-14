import { readFileIntoLines } from "../utils/readFile";

describe("Day 14 - Docking Data", () => {
  describe("Part I - What is the sum of all values left in memory after it completes?", () => {
    test("Example", () => {
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

  describe("Part II - Floating Bits - Emulator for a version 2 decoder chip.", () => {
    test("Example", () => {
      expect(
        decimalAddressToFloatingBitsAddresses(
          42,
          "000000000000000000000000000000X1001X"
        )
      ).toEqual([26, 27, 58, 59]);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(runDockingProgramV2(input)).toEqual(4355897790573);
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

// part 2
function runDockingProgramV2(instructionsStrs: string[]) {
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
      const addresses = decimalAddressToFloatingBitsAddresses(
        parseInt(assignee.match(/\d+/)![0], 10),
        currentMask
      );

      addresses.forEach((address) => memory.set(address, valueNum));
    }
  }

  return Array.from(memory.values()).reduce((a, b) => a + b, 0);
}

function decimalAddressToFloatingBitsAddresses(
  decimalAddress: number,
  mask: string
) {
  const addressWithFloatingBitsArr = decimalAddress
    .toString(2)
    .padStart(mask.length, "0")
    .split("");

  mask.split("").forEach((bitStr, i) => {
    // If the bitmask bit is 0, the corresponding memory address bit is unchanged.
    if (bitStr === "0") return;
    // If the bitmask bit is 1, the corresponding memory address bit is overwritten with 1.
    if (bitStr === "1") {
      addressWithFloatingBitsArr[i] = "1";
      return;
    }
    // If the bitmask bit is X, the corresponding memory address bit is floating.
    if (bitStr === "X") {
      addressWithFloatingBitsArr[i] = "X";
    }
  });

  return resolveFloatingBits(addressWithFloatingBitsArr);
}

function resolveFloatingBits(numFloatingBits: string[]) {
  const floatingBitsReversed = [...numFloatingBits].reverse();
  let results = [0];

  floatingBitsReversed.forEach((bit, index) => {
    if (bit === "1") {
      results.forEach((currentValue, i) => {
        results[i] = currentValue + Math.pow(2, index);
      });
    } else if (bit === "X") {
      results = results.flatMap((currentValue) => [
        currentValue + Math.pow(2, index),
        currentValue,
      ]);
    }
  });

  return results;
}

// org:
// function resolveFloatingBits(numFloatingBits: string[]) {
//   let results = new Set<string[]>();
//
//   results.add(numFloatingBits);
//
//   numFloatingBits.forEach((bit, index) => {
//     if (bit === "X") {
//       const nextResults = new Set<string[]>();
//
//       results.forEach((bits) => {
//         const zero = [...bits];
//         const one = [...bits];
//         zero[index] = "0";
//         one[index] = "1";
//
//         nextResults.add(zero);
//         nextResults.add(one);
//       });
//
//       results = nextResults;
//     }
//   });
//
//   return Array.from(results.values()).map((bits) => bits.join(""));
// }
