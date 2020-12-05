import { input } from "./input";

describe("day 01 - part II", () => {
  it("should produce correct triplet", () => {
    const sums: { value: number; numbers: number[] }[] = [];

    for (const num of input) {
      sums.push({
        value: num,
        numbers: [num],
      });

      for (const sum of sums) {
        if (sum.numbers.length === 3) {
          continue;
        }
        if (sum.value + num > 2020) {
          continue;
        }

        sums.push({
          value: sum.value + num,
          numbers: sum.numbers.concat(num),
        });
      }
    }

    const triplet = sums.find(
      (sum) => sum.value === 2020 && sum.numbers.length === 3
    );
    const [a, b, c] = triplet?.numbers ?? [];
    const result = a * b * c;

    expect(triplet).toMatchInlineSnapshot(`
    Object {
      "numbers": Array [
        438,
        360,
        1222,
      ],
      "value": 2020,
    }
  `);
    expect(result).toMatchInlineSnapshot(`192684960`);
  });
});
