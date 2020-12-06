import { readFileIntoLines } from "../../utils/readFile";

type WirePathStr = string;
type XYPos = { x: number; y: number };
type ClosestIntersection = { x: number; y: number; distance: number };
type XYPosWithPossibleIntersection = XYPos & {
  closestIntersection?: ClosestIntersection;
};

function instructionToXYMovement(instruction: string): XYPos {
  const [direction, value] = [
    instruction.substr(0, 1),
    Number(instruction.substr(1)),
  ];

  return {
    x: direction === "R" ? value : direction === "L" ? value * -1 : 0,
    y: direction === "U" ? value : direction === "D" ? value * -1 : 0,
  };
}

function getManhattenDistanceClosestIntersection(
  wireAStr: WirePathStr,
  wireBStr: WirePathStr
): number {
  const wireAPasses = new Set<string>();
  const wirePathA: XYPos[] = wireAStr.split(",").reduce(
    (acc, instruction) => {
      let latestPos = acc[acc.length - 1];
      const movement = instructionToXYMovement(instruction);

      while (movement.x || movement.y) {
        const diffX = movement.x === 0 ? 0 : movement.x > 0 ? 1 : -1;
        const diffY = movement.y === 0 ? 0 : movement.y > 0 ? 1 : -1;

        latestPos = {
          x: latestPos.x + diffX,
          y: latestPos.y + diffY,
        };

        acc.push(latestPos);

        wireAPasses.add(latestPos.x + "|" + latestPos.y);

        movement.x += -diffX;
        movement.y += -diffY;
      }

      return acc;
    },
    [{ x: 0, y: 0 }]
  );

  const pathBIntersection: XYPosWithPossibleIntersection = wireBStr
    .split(",")
    .reduce(
      (latest, instruction) => {
        const movement = instructionToXYMovement(instruction);

        while (movement.x || movement.y) {
          const diffX = movement.x === 0 ? 0 : movement.x > 0 ? 1 : -1;
          const diffY = movement.y === 0 ? 0 : movement.y > 0 ? 1 : -1;

          latest = {
            ...latest,
            x: latest.x + diffX,
            y: latest.y + diffY,
          };

          if (wireAPasses.has(latest.x + "|" + latest.y)) {
            const distance = Math.abs(latest.x) + Math.abs(latest.y);

            if (
              !latest.closestIntersection ||
              distance <= latest.closestIntersection.distance
            ) {
              latest.closestIntersection = {
                x: latest.x,
                y: latest.y,
                distance,
              };
            }
          }

          movement.x += -diffX;
          movement.y += -diffY;
        }

        return latest;
      },
      { x: 0, y: 0 } as XYPosWithPossibleIntersection
    );

  return pathBIntersection.closestIntersection?.distance || 0;
}

describe("Crossed Wires", () => {
  test("Examples - What is the Manhattan distance from the central port to the closest intersection?", () => {
    expect(
      getManhattenDistanceClosestIntersection("R8,U5,L5,D3", "U7,R6,D4,L4")
    ).toEqual(6);
    expect(
      getManhattenDistanceClosestIntersection(
        "R75,D30,R83,U83,L12,D49,R71,U7,L72",
        "U62,R66,U55,R34,D71,R55,D58,R83"
      )
    ).toEqual(159);
    expect(
      getManhattenDistanceClosestIntersection(
        "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
        "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
      )
    ).toEqual(135);
  });

  test("Input Data - What is the Manhattan distance from the central port to the closest intersection?", () => {
    const [wireA, wireB] = readFileIntoLines(`${__dirname}/input.txt`);
    expect(
      getManhattenDistanceClosestIntersection(wireA, wireB)
    ).toMatchInlineSnapshot(`316`);
  });
});
