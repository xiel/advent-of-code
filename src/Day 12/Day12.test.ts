import { readFileIntoLines } from "../utils/readFile";

describe("Day 11 - Rain Risk", () => {
  // Figure out where the navigation instructions lead. What is the Manhattan distance between that location and the ship's starting position?
  describe("Part I - What is the Manhattan distance between that location and the ship's starting position?", () => {
    test("Example", () => {
      const path = ["F10", "N3", "F7", "R90", "F11"];
      expect(followInstructions(path)).toEqual({ x: 17, y: 8 });
      expect(manhatten(followInstructions(path))).toEqual(25);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(manhatten(followInstructions(input))).toMatchInlineSnapshot(
        `1032`
      );
    });
  });
});

function manhatten({ x, y }: { x: number; y: number }) {
  return Math.abs(x) + Math.abs(y);
}

const DIRS = Object.freeze(["N", "E", "S", "W"]);

function followInstructions(instructions: string[]) {
  let currentDirection = "E";
  const currentPosition = {
    x: 0, // E++
    y: 0, // S++
  };

  for (const instr of instructions) {
    const action = instr[0];
    const value = Number(instr.substr(1));
    applyAction(action, value);
  }

  function applyAction(action: string, value: number) {
    let dirIndex = NaN;
    switch (action) {
      // Action N means to move north by the given value.
      case "N":
        currentPosition.y -= value;
        break;
      // Action S means to move south by the given value.
      case "S":
        currentPosition.y += value;
        break;
      // Action E means to move east by the given value.
      case "E":
        currentPosition.x += value;
        break;
      // Action W means to move west by the given value.
      case "W":
        currentPosition.x -= value;
        break;
      // Action L means to turn left the given number of degrees.
      case "L":
        dirIndex = (DIRS.indexOf(currentDirection) - value / 90) % DIRS.length;
        currentDirection =
          DIRS[dirIndex >= 0 ? dirIndex : DIRS.length + dirIndex];
        break;
      // Action R means to turn right the given number of degrees.
      case "R":
        dirIndex = (DIRS.indexOf(currentDirection) + value / 90) % DIRS.length;
        currentDirection =
          DIRS[dirIndex >= 0 ? dirIndex : DIRS.length + dirIndex];
        break;
      // Action F means to move forward by the given value in the direction the ship is currently facing.
      case "F":
        applyAction(currentDirection, value);
        break;
      default:
        throw Error("unknown action: " + action);
    }
  }

  return currentPosition;
}
