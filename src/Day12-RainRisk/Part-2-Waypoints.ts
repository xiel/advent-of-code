export function followWaypointInstructions(instructions: string[]) {
  const pos = {
    x: 0, // W-- | E++
    y: 0, // N-- | S++
  };
  let relativeWaypoint = {
    x: 10,
    y: -1,
  };

  for (const instr of instructions) {
    const action = instr[0];
    const value = Number(instr.substr(1));
    applyAction(action, value);
  }

  function applyAction(action: string, value: number) {
    switch (action) {
      case "N":
        relativeWaypoint.y -= value;
        break;
      case "S":
        relativeWaypoint.y += value;
        break;
      case "E":
        relativeWaypoint.x += value;
        break;
      case "W":
        relativeWaypoint.x -= value;
        break;
      // Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
      case "L":
        {
          let turns = value / 90;
          while (turns) {
            relativeWaypoint = {
              x: relativeWaypoint.y * 1,
              y: relativeWaypoint.x * -1,
            };
            turns--;
          }
        }
        break;
      // Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
      case "R":
        {
          let turns = value / 90;
          while (turns) {
            relativeWaypoint = {
              x: relativeWaypoint.y * -1,
              y: relativeWaypoint.x * 1,
            };
            turns--;
          }
        }
        break;
      case "F":
        pos.x += relativeWaypoint.x * value;
        pos.y += relativeWaypoint.y * value;
        break;
      default:
        throw Error("unknown action: " + action);
    }
  }

  return pos;
}
