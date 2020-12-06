import { readFileIntoLines } from "../../utils/readFile";

type ParsedIntCodeProgram = number[];

export function parseProgram(program: string): ParsedIntCodeProgram {
  return program.split(",").map((numberStr) => Number(numberStr));
}

export function programToString(program: ParsedIntCodeProgram) {
  return program.join(",");
}

export function runIntCode(
  program: string | number[],
  pointer = 0 // instruction pointer
): ParsedIntCodeProgram {
  const p = typeof program === "string" ? parseProgram(program) : program;
  const currentOpcode = p[pointer];

  let nextIndex: number;
  switch (currentOpcode) {
    // add
    case 1:
      p[p[pointer + 3]] = p[p[pointer + 1]] + p[p[pointer + 2]];
      nextIndex = pointer + 4;
      break;
    // multiply
    case 2:
      p[p[pointer + 3]] = p[p[pointer + 1]] * p[p[pointer + 2]];
      nextIndex = pointer + 4;
      break;
    // halt program
    case 99:
      return p;
      break;
    default:
      throw Error("unknown opcode " + currentOpcode);
  }

  return runIntCode(p, nextIndex);
}

// In this program, the value placed in address 1 is called the noun, and the value placed in address 2 is called the verb. Each of the two input values will be between 0 and 99, inclusive.
function tryInputsToFindSum(
  program: ParsedIntCodeProgram,
  desiredSum: number
): [number, number] {
  let noun = 0;
  while (noun <= 99) {
    let verb = 0;
    while (verb <= 99) {
      const currentProgram = [...program];

      currentProgram[1] = noun;
      currentProgram[2] = verb;

      const programResult = runIntCode(currentProgram)[0];

      if (programResult === desiredSum) {
        return [noun, verb];
      }

      verb++;
    }
    noun++;
  }

  throw Error("search ended without result");
}

describe("Intcode program", () => {
  it("should run intcode programs (examples)", () => {
    expect(programToString(runIntCode("1,0,0,0,99"))).toBe("2,0,0,0,99"); // (1 + 1 = 2)
    expect(programToString(runIntCode("2,3,0,3,99"))).toBe("2,3,0,6,99"); // (3 * 2 = 6)
    expect(programToString(runIntCode("2,4,4,5,99,0"))).toBe("2,4,4,5,99,9801"); // (99 * 99 = 9801)
    expect(programToString(runIntCode("1,1,1,4,99,5,6,0,99"))).toBe(
      "30,1,1,4,2,5,6,0,99"
    );
  });

  it("should run input intcode program", () => {
    // Once you have a working computer, the first step is to restore the gravity assist program (your puzzle input) to the "1202 program alarm" state it had just before the last computer caught fire.
    const inputProgram = parseProgram(
      readFileIntoLines(`${__dirname}/input.txt`)[0]
    );

    // To do this, before running the program, replace position 1 with the value 12 and replace position 2 with the value 2
    inputProgram[1] = 12;
    inputProgram[2] = 2;

    expect(runIntCode(inputProgram)[0]).toMatchInlineSnapshot(`5866714`);
  });

  it("should find input parameter to create a certain result", () => {
    const inputProgram = parseProgram(
      readFileIntoLines(`${__dirname}/input.txt`)[0]
    );
    const [noun, verb] = tryInputsToFindSum(inputProgram, 19690720);
    expect([noun, verb]).toMatchInlineSnapshot(`
      Array [
        52,
        8,
      ]
    `);
    expect(noun * 100 + verb).toMatchInlineSnapshot(`5208`);
  });
});
