export type SeatMap = string[][];
type SeatMapChange = (map: SeatMap) => SeatMap;
type SeatValue = "L" | "#" | ".";

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

/**
 * Part I:
 * All decisions are based on the number of occupied seats adjacent to a given seat
 * (one of the eight positions immediately up, down, left, right, or diagonal from the seat).
 * The following rules are applied to every seat simultaneously:
 * - If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
 * - If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
 *
 * Part II - New Rules:
 * - five or more visible occupied seats for an occupied seat to become empty (rather than four or more from the previous rules).
 * - empty seats that see no occupied seats become occupied,
 * - seats matching no rule don't change, and floor never changes.
 */
export function gameOfSeatingSystem(
  initialSeatMap: SeatMap,
  newRules = false,
  onTick?: (seatMap: SeatMap) => void
) {
  const width = initialSeatMap[0].length;
  const height = initialSeatMap.length;
  const occSeatsAroundBeforeGivingUpTheSeat = newRules ? 5 : 4;
  let currentSeatMap: SeatMap = Object.freeze(initialSeatMap) as SeatMap;

  function tick(): SeatMap {
    const changes: SeatMapChange[] = [];

    onTick && onTick(currentSeatMap);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const seat = getSeatAt(x, y);

        if (seat === undefined) throw new Error("no seat");
        if (seat === EMPTY) {
          const occSeatsAround = newRules
            ? countOccupiedSeatsAroundThatWeCanSeeFrom(x, y)
            : countOccupiedAdjacentSeatsAround(x, y);

          if (occSeatsAround === 0) {
            changes.push(createChangeAction(x, y, OCCUPIED));
          }
        } else if (seat === OCCUPIED) {
          const occSeatsAround = newRules
            ? countOccupiedSeatsAroundThatWeCanSeeFrom(x, y)
            : countOccupiedAdjacentSeatsAround(x, y);

          if (occSeatsAround >= occSeatsAroundBeforeGivingUpTheSeat) {
            changes.push(createChangeAction(x, y, EMPTY));
          }
        }
      }
    }

    // apply changes and start next tick
    if (changes.length) {
      currentSeatMap = changes.reduce(
        (map, changeFn) => changeFn(map),
        currentSeatMap
      );

      return tick();
    }

    return currentSeatMap;
  }

  function getSeatAt(x: number, y: number): string | undefined {
    return currentSeatMap[y]?.[x];
  }

  function createChangeAction(x: number, y: number, newValue: SeatValue) {
    return (seatMap: SeatMap) => {
      const newMap = [...seatMap];
      newMap[y] = [...newMap[y]];
      newMap[y][x] = newValue;
      return Object.freeze(newMap) as SeatMap;
    };
  }

  function countOccupiedAdjacentSeatsAround(x: number, y: number) {
    return around.reduce((acc, aroundDir) => {
      if (getSeatAt(x + aroundDir.x, y + aroundDir.y) === OCCUPIED) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  // see means we keep looking towards the aroundDir until we find a SEAT (occupied or not will stop the search)
  function countOccupiedSeatsAroundThatWeCanSeeFrom(x: number, y: number) {
    return around.reduce((acc, aroundDir) => {
      let [lookX, lookY] = [x, y];
      while (aroundDir) {
        [lookX, lookY] = [lookX + aroundDir.x, lookY + aroundDir.y];
        const seatAtLookPos = getSeatAt(lookX, lookY);
        if (seatAtLookPos === FLOOR) continue;
        if (seatAtLookPos === OCCUPIED) return acc + 1;
        if (seatAtLookPos === EMPTY || seatAtLookPos === undefined) return acc;
      }
      return acc;
    }, 0);
  }

  return tick();
}

export function countOccupiedSeatInSeatMap(map: SeatMap) {
  return map.reduce(
    (acc, rows) =>
      rows.reduce(
        (innerAcc, seat) => innerAcc + (seat === OCCUPIED ? 1 : 0),
        acc
      ),
    0
  );
}
