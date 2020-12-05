import { input } from "./input";

describe("day 01 - part I", () => {
  it("should produce correct pair", () => {
    const matches: Record<number, number> = {};
    let pair!: [number, number];

    for (const num of input) {
      if (matches[num] !== undefined) {
        pair = [num, matches[num]];
        break;
      } else {
        matches[2020 - num] = num;
      }
    }

    expect(pair).toMatchInlineSnapshot(`
      Array [
        1473,
        547,
      ]
    `);

    const result = pair[0] * pair[1];

    expect(result).toMatchInlineSnapshot(`805731`);
  });
});
