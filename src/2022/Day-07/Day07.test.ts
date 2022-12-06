import { readFileIntoLines } from "../../utils/readFile";
import { asc, sum } from "../../utils/math";

// https://adventofcode.com/2022/day/7
describe("Day 07", () => {
  test("Example", () => {
    expect(solve(readFileIntoLines(__dirname + "/example.txt"))).toEqual({
      // Find all the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?
      smallerDirs: 95437,
      // Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?
      dirToDeleteSize: 24933642,
    });
  });

  test("Part 1 & 2", () => {
    expect(solve(readFileIntoLines(__dirname + "/input.txt"))).toEqual({
      smallerDirs: 1086293,
      dirToDeleteSize: 366028,
    });
  });
});

interface Dir {
  files: Set<File>;
  dirs: Set<Dir>;
  path: string[];
  size: number;
}

interface File {
  size: number;
}

function solve(lines: string[]) {
  const dirIndex = new Map<string, Dir>();

  let cwdStack = [""];
  let outputOf = "";

  for (const line of lines) {
    if (outputOf && line.startsWith("$")) {
      outputOf = "";
    }

    if (outputOf === "ls") {
      const dir = dirAt(cwdStack);
      const [sizeOrType, name] = line.split(" ");

      if (sizeOrType === "dir") {
        dir.dirs.add(dirAt([...cwdStack, name]));
      } else {
        dir.files.add({
          size: +sizeOrType,
        });
      }
    } else {
      const [, cmd, arg] = line.split(" ");

      if (cmd === "cd") {
        if (arg === "/") {
          cwdStack = [""];
        } else if (arg === "..") {
          cwdStack.pop();
        } else {
          cwdStack.push(arg);
        }
      }

      if (cmd === "ls") {
        outputOf = "ls";
      }
    }
  }

  const smallerDirs = [...dirIndex.values()]
    .filter((dir) => dir.size <= 100000)
    .map((dir) => dir.size)
    .reduce(sum);

  // The total disk space available to the filesystem is 70000000.
  const rootDir = dirIndex.get("/")!;
  const freeSpace = 70_000_000 - rootDir.size;
  const moreSpaceNeeded = 30_000_000 - freeSpace;
  const dirToDeleteSize = [...dirIndex.values()]
    .map((d) => d.size)
    .filter((size) => size >= moreSpaceNeeded)
    .sort(asc)
    .at(0);

  return {
    smallerDirs,
    dirToDeleteSize,
  };

  function toPath(wd: string[]) {
    return "/" + wd.filter(Boolean).join("/");
  }

  function dirAt(dirPath: string[]) {
    const path = toPath(dirPath);
    const dir: Dir = dirIndex.get(path) || {
      dirs: new Set(),
      files: new Set(),
      path: [...dirPath],
      get size() {
        return [...this.dirs, ...this.files].map((f) => f.size).reduce(sum);
      },
    };
    dirIndex.set(path, dir);
    return dir;
  }
}
