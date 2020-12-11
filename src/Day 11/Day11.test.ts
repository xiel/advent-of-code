import { readFileIntoLines } from "../utils/readFile";

const exampleEnd = [
  "#.#L.L#.##",
  "#LLL#LL.L#",
  "L.#.L..#..",
  "#L##.##.L#",
  "#.#L.LL.LL",
  "#.#L#L#.##",
  "..L.L.....",
  "#L#L##L#L#",
  "#.LLLLLL.L",
  "#.#L#L#.##",
];

describe("Day 11", () => {
  describe("Part I", () => {
    test("Example", () => {
      const list = readFileIntoLines(`${__dirname}/fixtures/example.txt`);
      const splitSeats = list.map((row) => row.split(""));

      // How many seats end up occupied?
      const seatMapAtEnd = gameOfSeatingArea(splitSeats);
      expect(seatMapAtEnd.map((row) => row.join(""))).toEqual(exampleEnd);
      expect(countOccupiedSeatInSeatMap(seatMapAtEnd)).toEqual(37);
    });

    test("Input", () => {
      const input = readFileIntoLines(`${__dirname}/fixtures/input.txt`);
      const splitSeats = input.map((row) => row.split(""));

      // How many seats end up occupied?
      const seatMapAtEnd = gameOfSeatingArea(splitSeats);
      expect(countOccupiedSeatInSeatMap(seatMapAtEnd)).toMatchInlineSnapshot(
        `2222`
      );
    });
  });
});

// All decisions are based on the number of occupied seats adjacent to a given seat
// (one of the eight positions immediately up, down, left, right, or diagonal from the seat).
//
// The following rules are applied to every seat simultaneously:
// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
type SeatMapChange = (map: SeatMap) => SeatMap;
type SeatMap = string[][];

const EMPTY = "L";
const OCCUPIED = "#";
const FLOOR = ".";

const around = Object.freeze([
  // above row
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  // curr row
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  // below row
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
]);

function gameOfSeatingArea(intialSeatMap: SeatMap) {
  let currentSeatMap: SeatMap = Object.freeze(intialSeatMap) as SeatMap;
  const width = intialSeatMap[0].length;
  const height = intialSeatMap.length;

  function getSeatAt(x: number, y: number): string | undefined {
    return currentSeatMap[y]?.[x];
  }

  function countOccupiedSeatsAround(x: number, y: number) {
    return around.reduce((acc, aroundDir) => {
      if (getSeatAt(x + aroundDir.x, y + aroundDir.y) === OCCUPIED) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  function tick(): SeatMap {
    const changes: SeatMapChange[] = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const seat = getSeatAt(x, y);

        if (seat === undefined) throw new Error("no seat");

        if (seat === EMPTY) {
          const occSeatsAround = countOccupiedSeatsAround(x, y);

          if (occSeatsAround === 0) {
            changes.push((map) => {
              const newMap = [...map];
              newMap[y] = [...newMap[y]];
              newMap[y][x] = OCCUPIED;
              return newMap as SeatMap;
            });
          }
        } else if (seat === OCCUPIED) {
          const occSeatsAround = countOccupiedSeatsAround(x, y);

          if (occSeatsAround >= 4) {
            changes.push((map) => {
              const newMap = [...map];
              newMap[y] = [...newMap[y]];
              newMap[y][x] = EMPTY;
              return newMap as SeatMap;
            });
          }
        }
      }
    }

    // apply changes
    if (changes.length) {
      currentSeatMap = changes.reduce(
        (map, changeFn) => changeFn(map),
        currentSeatMap
      );
      return tick();
    } else {
      console.log("finished");
    }

    return currentSeatMap;
  }

  return tick();
}

function countOccupiedSeatInSeatMap(map: SeatMap) {
  return map.reduce(
    (acc, rows) =>
      rows.reduce(
        (innerAcc, seat) => innerAcc + (seat === OCCUPIED ? 1 : 0),
        acc
      ),
    0
  );
}
