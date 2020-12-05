const ROWS = 128;
const MAX_ROW_INDEX = ROWS - 1;
const COLS = 8;
const MAX_COL_INDEX = COLS - 1;

interface BoardingPass {
  row: number;
  column: number;
  seatID: number;
}

// seatEncodedString -> binary space partitioning
export function parseBoardingPass(seatEncodedString: string): BoardingPass {
  const { row, column } = decodeSeat(seatEncodedString);
  const seatID = calcSeatId(row, column);
  return {
    row,
    column,
    seatID,
  };
}

export function parseBoardingPasses(
  seatEncodedStrings: string[]
): BoardingPass[] {
  return seatEncodedStrings.map((seatEncodedString) =>
    parseBoardingPass(seatEncodedString)
  );
}

export function getMaxSeatId(seatEncodedStrings: string[]) {
  return Math.max(
    ...parseBoardingPasses(seatEncodedStrings).map((pass) => pass.seatID)
  );
}

type Range = [number, number];

function createUpdateRangeWithMarkers(
  lowerMarker: string,
  upperMarker: string
) {
  return function updateRange(currentRange: Range, marker: string): Range {
    const [currentLow, currentUpper] = currentRange;
    const nextLowerRangeEnd = Math.floor((currentLow + currentUpper) / 2);

    if (marker === lowerMarker) {
      return [currentLow, nextLowerRangeEnd];
    } else if (marker === upperMarker) {
      return [nextLowerRangeEnd + 1, currentUpper];
    } else {
      throw new Error("unknown marker");
    }
  };
}

function decodeSeat(seatEncodedString: string) {
  const rowStringPart = seatEncodedString.substr(0, 7);
  const columnStringPart = seatEncodedString.substr(7, 3);
  const updateRowRange = createUpdateRangeWithMarkers("F", "B");
  const updateColumnRange = createUpdateRangeWithMarkers("L", "R");

  const rowRange: Range = rowStringPart
    .split("")
    .reduce<Range>(
      (currentRange, character) => updateRowRange(currentRange, character),
      [0, MAX_ROW_INDEX]
    );

  const columnRange: Range = columnStringPart
    .split("")
    .reduce<Range>(
      (currentRange, character) => updateColumnRange(currentRange, character),
      [0, MAX_COL_INDEX]
    );

  if (rowRange[0] !== rowRange[1])
    throw new Error("row range did not end up on one row");
  if (columnRange[0] !== columnRange[1])
    throw new Error("column range did not end up on one row");

  return {
    row: rowRange[0],
    column: columnRange[0],
  };
}

function calcSeatId(row: number, column: number) {
  return row * 8 + column;
}

export function findEmptySeatId(boardingPasses: BoardingPass[]): number {
  // create a set for fast look up
  const filledSeats = new Set(boardingPasses.map((p) => p.seatID));
  const maxSeatId = calcSeatId(ROWS, COLS);
  let currentSeatId = 0;

  while (currentSeatId <= maxSeatId) {
    if (
      !filledSeats.has(currentSeatId) &&
      filledSeats.has(currentSeatId - 1) &&
      filledSeats.has(currentSeatId + 1)
    ) {
      break;
    }
    currentSeatId++;
  }

  return currentSeatId;
}
