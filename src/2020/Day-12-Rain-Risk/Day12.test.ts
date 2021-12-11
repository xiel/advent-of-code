import { readFileIntoLines } from "../../utils/readFile";
import { followInstructions } from "./Part-1";
import { followWaypointInstructions } from "./Part-2-Waypoints";

describe("Day 12 - Rain Risk", () => {
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

  describe("Part II - Waypoints", () => {
    test("Example", () => {
      const path = ["F10", "N3", "F7", "R90", "F11"];
      expect(followWaypointInstructions(path)).toEqual({ x: 214, y: 72 });
      expect(manhatten(followWaypointInstructions(path))).toEqual(286);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      expect(
        manhatten(followWaypointInstructions(input))
      ).toMatchInlineSnapshot(`156735`);
    });
  });
});

function manhatten({ x, y }: { x: number; y: number }) {
  return Math.abs(x) + Math.abs(y);
}
