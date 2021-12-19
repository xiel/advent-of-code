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

  test("Part 01 - ...", () => {
    // expect(solve(oneScanner)); //.toBe(-1);
    expect(solve(example).beacons.length).toBe(exampleResolution.length);
    // expect(solve(input).beacons.length).toBe(-1);
  });

  test("Part 02 - ..", () => {
    // ...
  });
});

// Each scanner is capable of detecting all beacons in a large cube centered on the scanner;
// beacons that are at most 1000 units away from the scanner in each of the three axes (x, y, and z) have their precise position determined relative to the scanner.
// However, scanners cannot detect other scanners. The submarine has automatically summarized the relative positions of beacons detected by each scanner (your puzzle input)

type XYZ = [number, number, number];
const { stringify, parse } = JSON;
const { min, max, abs, floor, ceil, round } = Math;

function solve(lines: string[]) {
  const scanners = lines.map(createScanner);
  // This region can be reconstructed by finding pairs of scanners that have overlapping detection regions
  // Allowing you to reconstruct the beacon map one scanner at a time.
  scanners[0]!.x = 0;
  scanners[0]!.y = 0;

  const scannerZeroBeacons = scanners[0].beacons;
  const zeroDiffs = getDiffs(scannerZeroBeacons);

  const otherScanners = scanners.slice(1);
  const mapBeacons = new Map<string, XYZ>();

  otherScanners.forEach((scanner) => {
    // ... that there are AT LEAST 12 BEACONS that both scanners detect within the overlap.
    scanner.permutations.find((beaconPositionsInPermutation, i) => {
      const matchedBeaconsInPerm = new Map<string, XYZ>();
      const diffs = getDiffs(beaconPositionsInPermutation);

      diffs.forEach((diff) => {
        // TODO we can make look up faster by using a set
        const matchedZeroDiff = zeroDiffs.find(
          (d) => d.diffStr === diff.diffStr
        );
        if (matchedZeroDiff) {
          matchedZeroDiff.points.forEach((p) => {
            matchedBeaconsInPerm.set(stringify(p), p);
          });
        }
      });

      // This is the correct permutation stop checking
      // Now this scanner's beacons can also be used as valid orientation
      if (matchedBeaconsInPerm.size >= 12) {
        matchedBeaconsInPerm.forEach((value, key) => {
          mapBeacons.set(key, value);
        });

        // All other beacons in this permutation/rotation are can also be added
        beaconPositionsInPermutation.forEach((xyz) => {
          mapBeacons.set(stringify(xyz), xyz);
        });

        // Do not interate over other permutations in this scanner
        return true;
      }
    });
  });

  return { scanners, beacons: [...mapBeacons.values()] };

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
      beaconsCount: beacons.length,
      permutations,
    };
  }

  function calcDiff(a: XYZ, b: XYZ): XYZ {
    const [xA, yA, zA] = a;
    const [xB, yB, zB] = b;
    return [abs(xA - xB), abs(yA - yB), abs(zA - zB)];
  }

  type DiffInfo = { diff: XYZ; diffStr: string; points: [XYZ, XYZ] };

  function getDiffs(beacons: XYZ[]) {
    const connectionAdded = new Set<string>();
    const diffs: DiffInfo[] = [];
    for (let i = 0; i < beacons.length; i++) {
      for (let y = 0; y < beacons.length; y++) {
        if (i === y) continue;
        const keys = [`${i}<->${y}`, `${y}<->${i}`];
        if (keys.some((k) => connectionAdded.has(k))) continue;
        keys.forEach((k) => connectionAdded.add(k));

        const points: [XYZ, XYZ] = [beacons[i], beacons[y]];
        const diff = calcDiff(...points);
        diffs.push({
          points,
          diff,
          diffStr: stringify(diff),
        });
      }
    }
    return diffs;
  }
}
