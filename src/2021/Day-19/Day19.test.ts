/* eslint-disable no-self-assign */
import { readFileIntoGroups, readFileIntoLines } from "../../utils/readFile";

describe("Day 19", () => {
  const oneScanner = [
    `--- scanner 0 ---
    -1,-1,1
    -2,-2,2
    -3,-3,3
    -2,-3,1
    5,6,-4
    8,0,7
  `,
  ];
  const example = readFileIntoGroups(__dirname + "/example.txt");
  const exampleResolution = readFileIntoLines(
    __dirname + "/exampleResolution.txt"
  );
  const input = readFileIntoGroups(__dirname + "/input.txt");

  test("Part 1 & 2", () => {
    expect(solve(oneScanner));
    expect(solve(example).beacons.length).toBe(exampleResolution.length);
    expect(solve(example).largestScannerDistance).toBe(3621);

    const result = solve(input);
    // Part 1 - How many beacons are there?
    expect(result.beacons.length).toBe(483);
    // Part 2 - What is the largest Manhattan distance between any two scanners?
    expect(result.largestScannerDistance).toBe(14804);
  });
});

type XYZ = [number, number, number];

const { stringify } = JSON;
const { max, abs } = Math;

// Each scanner is capable of detecting all beacons in a large cube centered on the scanner;
// beacons that are at most 1000 units away from the scanner in each of the three axes (x, y, and z) have their precise position determined relative to the scanner.
// However, scanners cannot detect other scanners. The submarine has automatically summarized the relative positions of beacons detected by each scanner (your puzzle input)
function solve(lines: string[]) {
  const scanners = lines.map(createScanner);

  scanners[0]!.x = 0;
  scanners[0]!.y = 0;
  scanners[0]!.z = 0;

  const scannerZeroBeacons = scanners[0].beacons;
  let validDiffSets = getDiffs(scannerZeroBeacons, scanners[0]);

  const diffsCache = new Map<XYZ[], ReturnType<typeof getDiffs>>();

  const otherScanners = scanners.slice(1);
  const mapBeacons = new Map<string, XYZ>();

  scannerZeroBeacons.forEach((xyz) => {
    mapBeacons.set(stringify(xyz), xyz);
  });

  while (otherScanners.length) {
    const currentScanner = otherScanners.shift()!;

    const permutationForScanner = currentScanner.permutations.find(
      (beaconPositionsInPermutation) => {
        // Calc diff from every point to every point in permutation
        const diffsInPermutation = (() => {
          if (diffsCache.has(beaconPositionsInPermutation)) {
            return diffsCache.get(beaconPositionsInPermutation)!;
          }
          const dip = getDiffs(beaconPositionsInPermutation, currentScanner);
          diffsCache.set(beaconPositionsInPermutation, dip);
          return dip;
        })();

        // Find a point/origin that reaches at least 11 points (with itself they are 12 points) with the same diffs as the verified beacons
        let scannerPos: XYZ | undefined = undefined;
        const permutationMatches = validDiffSets.find((validDiffSet) => {
          return diffsInPermutation.find((diffsFrom) => {
            let newScannerPos: XYZ | undefined = undefined;
            const matchingDiffs = diffsFrom.filter((diffCurrent) =>
              validDiffSet.find((diffSet) => {
                const matches = diffSet.diffStr === diffCurrent.diffStr;

                if (matches && diffSet.scanner.x !== undefined) {
                  newScannerPos = [
                    diffSet.scanner.x! + diffSet.from[0] - diffCurrent.from[0],
                    diffSet.scanner.y! + diffSet.from[1] - diffCurrent.from[1],
                    diffSet.scanner.z! + diffSet.from[2] - diffCurrent.from[2],
                  ];
                }

                return matches;
              })
            );

            if (matchingDiffs.length >= 11) {
              scannerPos = newScannerPos;
            }
            return matchingDiffs.length >= 11;
          });
        });

        if (permutationMatches) {
          // Update Scanner position now
          const [x, y, z] = scannerPos!;
          currentScanner.x = x;
          currentScanner.y = y;
          currentScanner.z = z;

          // Calc position of beacons from neutral position (scanner 0) and add them
          beaconPositionsInPermutation.forEach(
            ([xBeacon, yBeacon, zBeacon]) => {
              const beaconNeutral: XYZ = [
                currentScanner.x! + xBeacon,
                currentScanner.y! + yBeacon,
                currentScanner.z! + zBeacon,
              ];

              mapBeacons.set(stringify(beaconNeutral), beaconNeutral);
            }
          );

          // Add diffs from this permutation to valid diff sets
          validDiffSets = validDiffSets.concat(diffsInPermutation);

          // Do not iterate over other permutations in this scanner
          return true;
        }
      }
    );

    // if not matched add back into cue
    if (!permutationForScanner) {
      otherScanners.push(currentScanner);
    }
  }

  const largestScannerDistance = getLargestScannerDistance();

  return {
    scanners,
    largestScannerDistance,
    beacons: [...mapBeacons.values()],
  };

  // Part 2
  function getLargestScannerDistance() {
    let maxManhattan = -Infinity;
    for (const scanner of scanners) {
      for (const scanner2 of scanners) {
        maxManhattan = max(
          maxManhattan,
          [
            abs(scanner.x! - scanner2.x!),
            abs(scanner.y! - scanner2.y!),
            abs(scanner.z! - scanner2.z!),
          ].reduce((a, b) => a + b, 0)
        );
      }
    }
    return maxManhattan;
  }

  function createScanner(des: string) {
    const [name, ...beaconsStr] = des
      .trim()
      .split("\n")
      .map((s) => s.trim());

    const beacons: XYZ[] = beaconsStr.map(
      (xyz) => xyz.split(",").map((s) => +s) as XYZ
    );

    // Unfortunately, there's a second problem: the scanners also don't know their rotation or facing direction.
    // Each scanner is rotated some integer number of 90-degree turns around all of the x, y, and z axes.
    const permutationsPerBeacon: XYZ[][] = beacons.map((beaconXYZ) => {
      let [x, y, z] = beaconXYZ;
      // Test to not create double entries
      let [xT, yT, zT] = [11, 22, 33];
      const testPerm = new Set<string>();
      const perms: XYZ[] = [];
      // turn to the right
      for (let turnAroundY = 0; turnAroundY < 4; turnAroundY++) {
        [x, y, z] = [-z, y, x];
        [xT, yT, zT] = [-zT, yT, xT];
        // roll right
        for (let turnAroundZ = 0; turnAroundZ < 4; turnAroundZ++) {
          [x, y, z] = [y, -x, z];
          [xT, yT, zT] = [yT, -xT, zT];
          // bow forward
          for (let turnAroundX = 0; turnAroundX < 4; turnAroundX++) {
            [x, y, z] = [x, -z, y];
            [xT, yT, zT] = [xT, -zT, yT];
            const permKey = stringify([xT, yT, zT]);
            if (!testPerm.has(permKey)) {
              testPerm.add(permKey);
              perms.push([z, x, y]);
            }
          }
        }
      }
      return perms;
    });

    const permutations = permutationsPerBeacon[0].map((_, i) => {
      return permutationsPerBeacon.map((b) => b[i]);
    });

    console.assert(
      permutations.length === 24,
      `Something is off. l: ${permutations.length}`
    );

    return {
      name,
      beacons,
      x: undefined as number | undefined,
      y: undefined as number | undefined,
      z: undefined as number | undefined,
      beaconsCount: beacons.length,
      permutations,
    };
  }

  function calcDiff(from: XYZ, to: XYZ): XYZ {
    const [xFrom, yFrom, zFrom] = from;
    const [xTo, yTo, zTo] = to;
    return [xTo - xFrom, yTo - yFrom, zTo - zFrom];
  }

  type Scanner = ReturnType<typeof createScanner>;
  type DiffInfo = {
    diff: XYZ;
    from: XYZ;
    to: XYZ;
    diffStr: string;
    scanner: Scanner;
  };

  function getDiffs(beacons: XYZ[], scanner: Scanner) {
    const diffs: DiffInfo[][] = [];
    for (let i = 0; i < beacons.length; i++) {
      const from = beacons[i];
      const fromHereDiffs: DiffInfo[] = [];
      diffs.push(fromHereDiffs);
      for (let y = 0; y < beacons.length; y++) {
        if (i === y) continue;

        const to = beacons[y];
        const diff = calcDiff(from, to);

        fromHereDiffs.push({
          from,
          to,
          diff,
          diffStr: stringify(diff),
          scanner,
        });
      }
    }
    return diffs;
  }
}
