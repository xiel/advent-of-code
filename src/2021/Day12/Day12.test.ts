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

function countPathsInCaveSystem(connections: string[]) {
  const caveMap = connections.reduce((map, connection) => {
    const [from, to] = connection.split("-");

    if (!map.has(from)) map.set(from, new Set<Cave>());
    if (!map.has(to)) map.set(to, new Set<Cave>());

    map.get(from)!.add(to);
    map.get(to)!.add(from);

    return map;
  }, new Map<Cave, Set<Cave>>());

  // How many paths through this cave system are there that visit small caves at most once?
  return findPaths("start").length;

  function findPaths(
    cave: Cave,
    visited: Set<Cave> = new Set<Cave>(),
    path: Cave[] = []
  ): string[][] {
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

  function isBigCave(cave: Cave) {
    return cave[0].toUpperCase() === cave[0];
  }
}

/**
 * After reviewing the available paths, you realize you might have time to visit a single small cave twice.
 * Specifically, big caves can be visited any number of times
 * However, the caves named start and end can only be visited exactly once each: once you leave the start cave, you may not return to it, and once you reach the end cave, the path must end immediately.
 */
function countPathsInCaveSystemTwo(connections: string[]) {
  const caveMap = connections.reduce((map, connection) => {
    const [from, to] = connection.split("-");

    if (!map.has(from)) map.set(from, new Set<Cave>());
    if (!map.has(to)) map.set(to, new Set<Cave>());

    map.get(from)!.add(to);
    map.get(to)!.add(from);

    return map;
  }, new Map<Cave, Set<Cave>>());

  // How many paths through this cave system are there that visit small caves at most once?
  return findPaths("start").length;

  function findPaths(
    cave: Cave,
    visited: Set<Cave> = new Set<Cave>(),
    path: Cave[] = [],
    smallCaveVisitedTwice: Cave = ""
  ): string[][] {
    const currentPath = [...path, cave];

    if (cave === "end") {
      return [currentPath];
    }

    const nextCaves = caveMap.get(cave)!;
    const newVisited = new Set(visited);
    newVisited.add(cave);

    return Array.from(nextCaves).flatMap((nextCave) => {
      if (isBigCave(nextCave)) {
        return findPaths(
          nextCave,
          newVisited,
          currentPath,
          smallCaveVisitedTwice
        );
      }

      // a single small cave can be visited at most twice, and the remaining small caves can be visited at most once.
      if (!newVisited.has(nextCave)) {
        return findPaths(
          nextCave,
          newVisited,
          currentPath,
          smallCaveVisitedTwice
        );
      } else if (nextCave !== "start" && !smallCaveVisitedTwice) {
        return findPaths(nextCave, newVisited, currentPath, cave);
      }

      return [];
    });
  }

  function isBigCave(cave: Cave) {
    return cave[0].toUpperCase() === cave[0];
  }
}
