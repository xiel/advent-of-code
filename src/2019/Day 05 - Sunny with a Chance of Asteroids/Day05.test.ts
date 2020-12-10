import { readFileIntoLines } from "../../utils/readFile"

type ParsedIntCodeProgram = number[]

export function parseProgram(program: string): ParsedIntCodeProgram {
  return program.split(",").map((numberStr) => Number(numberStr))
}

export function programToString(program: ParsedIntCodeProgram) {
  return program.join(",")
}

enum MODE {
  POSITION,
  IMMEDIATE,
}

export function runIntCode(
  program: string | number[],
  input = 1,
  output?: (out: string | number, nextOptcode: number) => void,
  pointer = 0 // instruction pointer
): ParsedIntCodeProgram {
  const p = typeof program === "string" ? parseProgram(program) : program

  const currentOpcodeStr = p[pointer] + ""
  const currentOpcode = Number(currentOpcodeStr.substr(-2))
  const [p1Mode, p2Mode, p3Mode] = currentOpcodeStr
    .split("")
    .reverse()
    .slice(2)
    .map((n) => (Number(n) ? MODE.IMMEDIATE : MODE.POSITION))

  const p1 = p1Mode === MODE.IMMEDIATE ? p[pointer + 1] : p[p[pointer + 1]]
  const p2 = p2Mode === MODE.IMMEDIATE ? p[pointer + 2] : p[p[pointer + 2]]
  const p3 = p3Mode === MODE.IMMEDIATE ? p[pointer + 3] : p[p[pointer + 3]]

  let nextIndex: number
  switch (currentOpcode) {
    // add
    case 1:
      p[p[pointer + 3]] = p1 + p2
      nextIndex = pointer + 4
      break
    // multiply
    case 2:
      p[p[pointer + 3]] = p1 * p2
      nextIndex = pointer + 4
      break
    // Opcode 3 takes a single integer as input and saves it to the position given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50.
    case 3:
      p[p[pointer + 1]] = input
      nextIndex = pointer + 2
      break
    // Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50.
    case 4:
      nextIndex = pointer + 2
      if (output) {
        output(p1, p[nextIndex])
      }
      break
    // Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
    case 5:
      if (p1 !== 0) {
        nextIndex = p2
      } else {
        nextIndex = pointer + 3
      }
      break
    // Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
    case 6:
      if (p1 === 0) {
        nextIndex = p2
      } else {
        nextIndex = pointer + 3
      }
      break
    // Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
    case 7:
      p[p[pointer + 3]] = p1 < p2 ? 1 : 0
      nextIndex = pointer + 4
      break
    // Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
    case 8:
      p[p[pointer + 3]] = p1 === p2 ? 1 : 0
      nextIndex = pointer + 4
      break
    // halt program
    case 99:
      return p
      break
    default:
      throw Error("unknown opcode " + currentOpcode)
  }

  return runIntCode(p, input, output, nextIndex)
}

describe("Day 05 - Sunny with a Chance of Asteroids", () => {
  it("should run intcode programs (examples)", () => {
    expect(programToString(runIntCode("1,0,0,0,99"))).toBe("2,0,0,0,99") // (1 + 1 = 2)
    expect(programToString(runIntCode("2,3,0,3,99"))).toBe("2,3,0,6,99") // (3 * 2 = 6)
    expect(programToString(runIntCode("2,4,4,5,99,0"))).toBe("2,4,4,5,99,9801") // (99 * 99 = 9801)
    expect(programToString(runIntCode("1,1,1,4,99,5,6,0,99"))).toBe(
      "30,1,1,4,2,5,6,0,99"
    )
  })

  it("should run input intcode program", () => {
    // Once you have a working computer, the first step is to restore the gravity assist program (your puzzle input) to the "1202 program alarm" state it had just before the last computer caught fire.
    const inputProgram = parseProgram(
      readFileIntoLines(`${__dirname}/fixtures/input.txt`)[0]
    )
    const outputFn = jest.fn()
    expect(runIntCode(inputProgram, 1, outputFn))
    expect(outputFn).toHaveBeenLastCalledWith(15259545, 99)
  })

  it("should run input intcode program with input: 5", () => {
    // Once you have a working computer, the first step is to restore the gravity assist program (your puzzle input) to the "1202 program alarm" state it had just before the last computer caught fire.
    const inputProgram = parseProgram(
      readFileIntoLines(`${__dirname}/fixtures/input.txt`)[0]
    )
    const outputFn = jest.fn()
    expect(runIntCode(inputProgram, 5, outputFn))
    expect(outputFn).toHaveBeenLastCalledWith(7616021, 99)
  })
})
