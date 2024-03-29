import { readFileSync } from "fs";

// entries are separted by empty lines in input file (empty groups are filtered out)
export function readFileIntoGroups(path: string) {
  return readFileSync(path, "utf-8").split("\n\n").filter(Boolean);
}

// one entry per line in input file (empty lines are filtered out)
export function readFileIntoLines(path: string) {
  return readFileSync(path, "utf-8").split("\n").filter(Boolean);
}

// one entry per line in input file (white spaces are trimmed and empty lines are removed & )
export function readExampleIntoLines(exampleStr: string) {
  return exampleStr
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function readExampleIntoGroups(exampleStr: string) {
  return exampleStr
    .split(/\n\s*\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}
