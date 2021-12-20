import { readFileIntoGroups } from "../../utils/readFile";
import { createCanvas } from "canvas";
import fs from "fs";
const { min, max } = Math;

// https://adventofcode.com/2021/day/20
describe("Day 20", () => {
  const example = readFileIntoGroups(__dirname + "/example.txt");
  const input = readFileIntoGroups(__dirname + "/input.txt");

  test("Part 1 & Part 2", async () => {
    expect(solve(example).onPixelsAfterTwo).toBe(35);

    // Part 1
    const resultInput = solve(input);
    expect(resultInput.onPixelsAfterTwo).toBe(5573);
    // part 2
    expect(resultInput.onPixelsAfterFifty).toBe(20097);
    // await resultInput.drawMap();
  });
});

interface Pixel {
  x: number;
  y: number;
  v: string;
}

function solve(lines: string[]) {
  const [enhancementAlgo, imageDataStr] = lines;
  const pixels: Pixel[] = imageDataStr
    .split("\n")
    .flatMap((l, y) => l.split("").map((v, x) => ({ v, x, y })));
  let pixelMap = new Map<string, Pixel>(pixels.map((p) => [_(p.x, p.y), p]));
  let voidPixelValue = ".";

  enhance();
  enhance();

  let steps = 2;

  return {
    onPixelsAfterTwo: getActivePixels().length,
    get onPixelsAfterFifty() {
      for (; steps < 50; steps++) {
        enhance();
      }
      return getActivePixels().length;
    },
    drawMap,
  };

  function getActivePixels() {
    return [...pixelMap.values()].filter((p) => p.v === "#");
  }

  function enhance() {
    const xs = [...pixelMap.values()].map((p) => p.x);
    const ys = [...pixelMap.values()].map((p) => p.y);
    const [xMin, xMax] = [min(Infinity, ...xs) - 2, max(-Infinity, ...xs) + 2];
    const [yMin, yMax] = [min(Infinity, ...ys) - 2, max(-Infinity, ...ys) + 2];
    const newPixelMap = new Map<string, Pixel>();

    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        const updateIndex = getAlgoIndexAroundPixel(x, y);
        const updateValue = enhancementAlgo[updateIndex];
        newPixelMap.set(_(x, y), {
          x,
          y,
          v: updateValue,
        });
      }
    }

    // Update pixels in the infinite void
    const voidUpdateIndex = getAlgoIndexAroundPixel(Infinity, Infinity);
    voidPixelValue = enhancementAlgo[voidUpdateIndex];

    pixelMap = newPixelMap;
  }

  function getAlgoIndexAroundPixel(x: number, y: number) {
    const pixelsAround: Pixel[] = [];

    for (let aroundY = -1; aroundY < 2; aroundY++) {
      for (let aroundX = -1; aroundX < 2; aroundX++) {
        pixelsAround.push(getPixelAt(x + aroundX, y + aroundY));
      }
    }

    const binaryStr = pixelsAround
      .map((p) => (p.v === "#" ? "1" : "0"))
      .join("");

    return parseInt(binaryStr, 2);
  }

  function getPixelAt(x: number, y: number): Pixel {
    const foundPixel = pixelMap.get(_(x, y));
    return (
      foundPixel ?? {
        x,
        y,
        v: voidPixelValue,
      }
    );
  }

  function _(...args: (string | number)[]) {
    return args.join();
  }

  async function drawMap() {
    const pixels = getActivePixels();
    const xs = pixels.map((p) => p.x);
    const ys = pixels.map((p) => p.y);
    const [xMin, xMax] = [min(Infinity, ...xs), max(-Infinity, ...xs)];
    const [yMin, yMax] = [min(Infinity, ...ys), max(-Infinity, ...ys)];
    const width = xMax - xMin;
    const height = yMax - yMin;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    const shiftX = Math.abs(xMin);
    const shiftY = Math.abs(yMin);

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = `#000000`;
    pixels.forEach((p) => {
      context.fillRect(p.x + shiftX, p.y + shiftY, 1, 1);
    });

    const buffer = canvas.toBuffer("image/png");
    return new Promise((resolve) => {
      fs.writeFile(`${__dirname}/${width}x${height}.png`, buffer, resolve);
    });
  }
}
