import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

const { floor, ceil } = Math;
const json = JSON.parse;

describe("Day 18: Snailfish", () => {
  const example = readExampleIntoLines(`
    [1,1]
    [2,2]
    [3,3]
    [4,4]
  `);
  const exampleSmall = readExampleIntoLines(`
    [[[[4,3],4],4],[7,[[8,4],9]]]
    [1,1]
  `);
  const exampleMedium = readExampleIntoLines(`
    [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
    [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
    [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
    [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
    [7,[5,[[3,8],[1,4]]]]
    [[2,[2,2]],[8,[8,1]]]
    [2,9]
    [1,[[[9,3],9],[[9,0],[0,7]]]]
    [[[5,[7,4]],7],1]
    [[[[4,2],2],6],[8,7]]
  `);
  const exampleBig = readExampleIntoLines(`
    [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
    [[[5,[2,8]],4],[5,[[9,9],0]]]
    [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
    [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
    [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
    [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
    [[[[5,4],[7,7]],8],[[8,3],8]]
    [[9,3],[[9,9],[6,[4,9]]]]
    [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
    [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
  `);

  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - What is the magnitude of the final sum?", () => {
    expect(magnitude(json("[[1,2],[[3,4],5]]"))).toBe(143);
    expect(magnitude(json("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]"))).toBe(1384);
    expect(
      magnitude(json("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"))
    ).toBe(3488);

    expect(magnitude(sumSnailNumbers(example))).toBe(445);
    expect(magnitude(sumSnailNumbers(exampleSmall))).toBe(1384);
    expect(magnitude(sumSnailNumbers(exampleMedium))).toBe(3488);
    expect(magnitude(sumSnailNumbers(exampleBig))).toBe(4140);
    expect(magnitude(sumSnailNumbers(input))).toBe(4207);
  });

  test("Part 02 - ..", () => {
    // ...
  });
});

type Num = number;
type SnailNumber = (Num | SnailNumber)[];
function isSnailNumber(n: Num | SnailNumber): n is SnailNumber {
  return Array.isArray(n);
}

function sumSnailNumbers(lines: string[]): SnailNumber {
  const snailNumbers: SnailNumber[] = lines.map((l) => json(l));
  let sum = snailNumbers.shift()!;

  while (snailNumbers.length) {
    // add - or example, [1,2] + [[3,4],5] becomes [[1,2],[[3,4],5]].
    const adding = snailNumbers.shift()!;

    sum = [sum, adding];

    // Reducing
    // eslint-disable-next-line no-constant-condition
    reducing: while (true) {
      let lastSeenRegularIn: { sn: SnailNumber; at: number } | undefined;
      let updateNextRegularWith: number | undefined = undefined;

      // Exploding
      // If any pair is nested inside four pairs, the leftmost such pair explodes.
      for (const [i1, e1] of sum.entries()) {
        if (!isSnailNumber(e1)) {
          if (updateNextRegularWith !== undefined) {
            sum[i1] = +sum[i1] + updateNextRegularWith;
            continue reducing;
          }
          lastSeenRegularIn = { sn: sum, at: i1 };
          continue;
        }
        for (const [i2, e2] of e1.entries()) {
          if (!isSnailNumber(e2)) {
            if (updateNextRegularWith !== undefined) {
              e1[i2] = +e1[i2] + updateNextRegularWith;
              continue reducing;
            }
            lastSeenRegularIn = { sn: e1, at: i2 };
            continue;
          }
          for (const [i3, e3] of e2.entries()) {
            if (!isSnailNumber(e3)) {
              if (updateNextRegularWith !== undefined) {
                e2[i3] = +e2[i3] + updateNextRegularWith;
                continue reducing;
              }
              lastSeenRegularIn = { sn: e2, at: i3 };
              continue;
            }
            for (const [i4, e4] of e3.entries()) {
              if (updateNextRegularWith !== undefined) {
                if (isSnailNumber(e4)) {
                  for (const [i5, e5] of e4.entries()) {
                    if (isSnailNumber(e5))
                      throw Error("wtf how deep is this shit.");
                    e4[i5] = +e4[i5] + updateNextRegularWith;
                    continue reducing;
                  }
                } else {
                  e3[i4] = +e3[i4] + updateNextRegularWith;
                  continue reducing;
                }
              }
              if (!isSnailNumber(e4)) {
                lastSeenRegularIn = { sn: e3, at: i4 };
              } else {
                // TODO: iterate when updateNextRegularWith
                if (e4.length !== 2) throw Error("must be length 2.");

                const [left, right] = e4;

                //  Exploding pairs will always consist of two regular numbers.
                if (isSnailNumber(left) || isSnailNumber(right))
                  throw Error("Must be a regular number.");

                //  To explode a pair, the pair's left value is added to the first regular number to the left of the exploding pair (if any),
                if (lastSeenRegularIn) {
                  const { sn, at } = lastSeenRegularIn;
                  sn[at] = Number(sn[at]) + left;
                }
                //  and the pair's right value is added to the first regular number to the right of the exploding pair (if any).
                updateNextRegularWith = right;

                //  Then, the entire exploding pair is replaced with the regular number 0.
                e3[i4] = 0;
              }
            }
          }
        }
      }

      if (updateNextRegularWith) {
        continue;
      }

      // If any regular number is 10 or greater, the leftmost such regular number splits.
      // To split a regular number, replace it with a pair;
      // the left element of the pair should be the regular number divided by two and rounded down,
      // while the right element of the pair should be the regular number divided by two and rounded up.
      // For example, 10 becomes [5,5], 11 becomes [5,6], 12 becomes [6,6], and so on.
      for (const [i1, e1] of sum.entries()) {
        if (splitIfNeeded(sum, i1)) continue reducing;
        if (!isSnailNumber(e1)) continue;
        for (const [i2, e2] of e1.entries()) {
          if (splitIfNeeded(e1, i2)) continue reducing;
          if (!isSnailNumber(e2)) continue;
          for (const [i3, e3] of e2.entries()) {
            if (splitIfNeeded(e2, i3)) continue reducing;
            if (!isSnailNumber(e3)) continue;
            for (const [i4, e4] of e3.entries()) {
              if (splitIfNeeded(e3, i4)) continue reducing;
              if (!isSnailNumber(e3)) continue;
            }
          }
        }
      }

      // Stop when nothing happened (continue called)
      break reducing;
    }
  }

  return sum;

  function splitIfNeeded(sn: SnailNumber, at: number): boolean {
    const element = sn[at];
    if (typeof element === "number" && element >= 10) {
      const half = element / 2;
      sn[at] = [floor(half), ceil(half)];
      return true;
    }
    return false;
  }
}

function magnitude(num: SnailNumber | number): number {
  // The magnitude of a regular number is just that number.
  if (typeof num === "number") return num;
  const [left, right] = num;
  // The magnitude of a pair is 3 times the magnitude of its left element plus 2 times the magnitude of its right element.
  return magnitude(left) * 3 + magnitude(right) * 2;
}
