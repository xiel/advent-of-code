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
  cursor = 0
): ParsedIntCodeProgram {
  let nextIndex: number;
  const p = typeof program === "string" ? parseProgram(program) : program;
  const currentOpcode = p[cursor];

  switch (currentOpcode) {
    // add
    case 1:
      p[p[cursor + 3]] = p[p[cursor + 1]] + p[p[cursor + 2]];
      nextIndex = cursor + 4;
      break;
    // multiply
    case 2:
      p[p[cursor + 3]] = p[p[cursor + 1]] * p[p[cursor + 2]];
      nextIndex = cursor + 4;
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
});
