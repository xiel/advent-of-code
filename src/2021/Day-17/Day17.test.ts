describe("Day 17: Trick Shot", () => {
  const example = solve("target area: x=20..30, y=-10..-5");
  const input = solve("target area: x=135..155, y=-102..-78");

  test("Part 1 & Part 2", () => {
    // Part 1 - What is the highest y position it reaches on this trajectory?
    expect(example.highestPos).toBe(45);
    expect(input.highestPos).toBe(5151);

    // Part 2 - How many distinct initial velocity values cause the probe to be within the target area after any step?
    expect(example.initialVelos).toBe(112);
    expect(input.initialVelos).toBe(968);
  });
});

function solve(line: string) {
  const [[xFrom, xTo], [yFrom, yTo]] = line
    .replace("target area: ", "")
    .split(",")
    .map((s) =>
      s
        .trim()
        .split("=")[1]
        .split("..")
        .map((n) => +n)
    );

  const initialVelos = new Set<string>();

  let highestPos = -Infinity;

  for (let initVelocityX = 1; initVelocityX <= xTo; initVelocityX++) {
    for (let initVelocityY = yFrom; initVelocityY <= 1000; initVelocityY++) {
      const key = [initVelocityX, initVelocityY].join();
      const pos = {
        x: 0,
        y: 0,
      };
      const velo = {
        x: initVelocityX,
        y: initVelocityY,
      };

      let probesHighest = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        // The probe's x position increases by its x velocity.
        pos.x += velo.x;
        // The probe's y position increases by its y velocity.
        pos.y += velo.y;

        probesHighest = Math.max(pos.y, probesHighest);

        // Is in target area?
        if (pos.x >= xFrom && pos.x <= xTo && pos.y >= yFrom && pos.y <= yTo) {
          if (probesHighest > highestPos) {
            highestPos = probesHighest;
          }
          initialVelos.add(key);
          break;
        }

        if (pos.x > xTo || pos.y < yFrom) {
          break;
        }

        // Due to drag, the probe's x velocity changes by 1 toward the value 0
        if (velo.x) {
          velo.x += velo.x > 0 ? -1 : 1;
        }

        // Due to gravity, the probe's y velocity decreases by 1.
        velo.y--;
      }
    }
  }

  return {
    highestPos,
    initialVelos: initialVelos.size,
  };
}
