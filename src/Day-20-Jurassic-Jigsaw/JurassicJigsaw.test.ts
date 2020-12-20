import { readFileIntoGroups } from "../utils/readFile";
import {
  fixImageTiles,
  parseTile,
  productOfCornerTiles,
} from "./JurassicJigsaw";

const testTile = `
###
#..
.##
`;

describe("Day 19 - Jurassic Jigsaw", () => {
  describe("Part I - What do you get if you multiply together the IDs of the four corner tiles?", () => {
    test("Experiment", () => {
      const tile = parseTile(testTile);
      expect(tile.data.join("\n")).toMatchInlineSnapshot(`
        "#,#,#
        #,.,.
        .,#,#"
      `);
      tile.flipX();
      expect(tile.data.join("\n")).toMatchInlineSnapshot(`
        "#,#,#
        .,.,#
        #,#,."
      `);
      tile.rotate();
      expect(tile.data.join("\n")).toMatchInlineSnapshot(`
        "#,#,.
        #,.,#
        #,.,#"
      `);
      tile.rotate();
      expect(tile.data.join("\n")).toMatchInlineSnapshot(`
        ".,#,#
        #,.,.
        #,#,#"
      `);
      expect(tile.topEdge()).toEqual(".##");
      expect(tile.rightEdge()).toEqual("#.#");
      expect(tile.bottomEdge()).toEqual("###");
      expect(tile.leftEdge()).toEqual(".##");
    });

    test("Example", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/example.txt`);
      expect(productOfCornerTiles(fixImageTiles(input))).toEqual(
        20899048083289
      );
    });

    test("Input", () => {
      const input = readFileIntoGroups(`${__dirname}/fixtures/input.txt`);
      expect(productOfCornerTiles(fixImageTiles(input))).toMatchInlineSnapshot(
        `54755174472007`
      );
    });
  });
});
