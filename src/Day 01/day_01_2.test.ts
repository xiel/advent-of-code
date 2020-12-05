import { input } from "./input";

describe("day 01 - part II", () => {
  it("should produce correct triplet", () => {
    const sums: { value: number; numbers: number[] }[] = [];

    loopOverInputs: for (const num of input) {
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

        const value = sum.value + num;
        const numbers = sum.numbers.concat(num);

        sums.push({
          value,
          numbers,
        });

        if (value === 2020 && numbers.length === 3) {
          break loopOverInputs;
        }
      }
    }

    const triplet = sums.find(
      (sum) => sum.value === 2020 && sum.numbers.length === 3
    );
    const [a, b, c] = triplet?.numbers ?? [];
    const productResult = a * b * c;

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
    expect(productResult).toMatchInlineSnapshot(`192684960`);
  });
});
