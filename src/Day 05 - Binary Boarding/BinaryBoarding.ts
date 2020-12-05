// seatEncodedString -> binary space partitioning
export function parseBoardingPass(seatEncodedString: string) {
  const { row, column } = decodeSeat(seatEncodedString);
  const seatID = calcSeatId(row, column);
  return {
    row,
    column,
    seatID,
  };
}

export function getMaxSeatId(seatEncodedStrings: string[]) {
  return Math.max(
    ...seatEncodedStrings.map(
      (seatEncodedString) => parseBoardingPass(seatEncodedString).seatID
    )
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
    const nextLowerRange: Range = [currentLow, nextLowerRangeEnd];
    const nextUpperRange: Range = [nextLowerRangeEnd + 1, currentUpper];

    if (marker === lowerMarker) {
      return nextLowerRange;
    } else if (marker === upperMarker) {
      return nextUpperRange;
    } else {
      throw new Error("unknown marker");
    }
  };
}

const rows = 128;
const maxRowIndex = rows - 1;
const columns = 8;
const maxColumnIndex = columns - 1;

function decodeSeat(seatEncodedString: string) {
  const rowStringPart = seatEncodedString.substr(0, 7);
  const columnStringPart = seatEncodedString.substr(7, 3);

  const updateRowRange = createUpdateRangeWithMarkers("F", "B");
  const updateColumnRange = createUpdateRangeWithMarkers("L", "R");

  const initialRowRange: Range = [0, maxRowIndex];
  const initialColumnRange: Range = [0, maxColumnIndex];

  const rowRange = rowStringPart
    .split("")
    .reduce(
      (currentRange, character) => updateRowRange(currentRange, character),
      initialRowRange
    );

  const columnRange = columnStringPart
    .split("")
    .reduce(
      (currentRange, character) => updateColumnRange(currentRange, character),
      initialColumnRange
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
