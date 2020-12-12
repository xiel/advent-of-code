const DIRS = Object.freeze(["N", "E", "S", "W"]);

export function followInstructions(instructions: string[]) {
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
