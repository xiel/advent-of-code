import { readFileIntoLines } from "../../utils/readFile";

const example = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

// https://adventofcode.com/2021/day/12
describe("Day 12: Passage Pathing", () => {
  test("01 - Example", () => {
    const input = example.split(/\n/);
    expect(countPathsInCaveSystem(input)).toBe(10);
  });

  test("01", () => {
    const input = readFileIntoLines(`${__dirname}/input.txt`);
    expect(countPathsInCaveSystem(input)).toBe(4411);
  });

  test("02 - Example", () => {
    const input = example.split(/\n/);
    expect(countPathsInCaveSystemTwo(input)).toBe(36);
  });

  test("02", () => {
    const input = readFileIntoLines(`${__dirname}/input.txt`);
    expect(countPathsInCaveSystemTwo(input)).toBe(136767);
  });
});

type Cave = string;

function buildCaveMap(connections: string[]) {
  return connections.reduce((map, connection) => {
    const [from, to] = connection.split("-");

    if (!map.has(from)) map.set(from, new Set<Cave>());
    if (!map.has(to)) map.set(to, new Set<Cave>());

    map.get(from)!.add(to);
    map.get(to)!.add(from);

    return map;
  }, new Map<Cave, Set<Cave>>());
}

function countPathsInCaveSystem(connections: string[]) {
  const caveMap = buildCaveMap(connections);
  return findPaths("start").length;

  function findPaths(
    cave: Cave,
    visited: Set<Cave> = new Set<Cave>(),
    path: Cave[] = []
  ): Cave[][] {
    const currentPath = [...path, cave];

    if (cave === "end") {
      return [currentPath];
    }

    const nextCaves = caveMap.get(cave)!;
    const newVisited = new Set(visited);
    newVisited.add(cave);

    return Array.from(nextCaves).flatMap((nextCave) => {
      // big caves (written in uppercase, like A) and small caves (written in lowercase, like b)
      // don't visit small caves more than once
      if (newVisited.has(nextCave) && !isBigCave(nextCave)) {
        return [];
      }
      return findPaths(nextCave, newVisited, currentPath);
    });
  }
}

function countPathsInCaveSystemTwo(connections: string[]) {
  const caveMap = buildCaveMap(connections);

  return findPaths("start").length;

  function findPaths(
    cave: Cave,
    visited: Set<Cave> = new Set<Cave>(),
    path: Cave[] = [],
    smallCaveVisitedTwice: Cave = ""
  ): Cave[][] {
    const currentPath = [...path, cave];

    if (cave === "end") {
      return [currentPath];
    }

    const nextCaves = caveMap.get(cave)!;
    const newVisited = new Set(visited);
    newVisited.add(cave);

    return Array.from(nextCaves).flatMap((nextCave) => {
      if (isBigCave(nextCave) || !newVisited.has(nextCave)) {
        return findPaths(
          nextCave,
          newVisited,
          currentPath,
          smallCaveVisitedTwice
        );

        // A single small cave can be visited at most twice, and the remaining small caves can be visited at most once.
      } else if (!smallCaveVisitedTwice && nextCave !== "start") {
        return findPaths(nextCave, newVisited, currentPath, cave);
      } else {
        return [];
      }
    });
  }
}

function isBigCave(cave: Cave) {
  return cave[0].toUpperCase() === cave[0];
}
