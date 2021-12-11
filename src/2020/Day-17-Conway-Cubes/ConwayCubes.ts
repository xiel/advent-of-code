interface Props {
  initialState: string[];
  stopAfterCycles?: number;
  onCycle?: (cycleCount: number, activeCells: ActiveCells) => void;
}

type CellCoord = [number, number, number]; // [x,y,z]
type CellCoordStr = string; // "x,y,z"
type ActiveCells = Set<CellCoordStr>;
type ChangeAction = () => void;

const aroundIterator = Object.freeze([-1, 0, 1]);

export function ConwayCubes({
  initialState,
  stopAfterCycles = 6,
  onCycle,
}: Props) {
  const activeCells: ActiveCells = new Set();
  let cycleCount = 0;

  loadInitialState();
  cycle();

  return {
    activeCells,
    cycleCount,
  };

  function loadInitialState() {
    initialState.forEach((rows, y) => {
      rows.split("").forEach((entry, x) => {
        if (entry === "#") {
          activeCells.add(cellCoordStr(x, y));
        }
      });
    });
  }

  async function cycle() {
    cycleCount++;

    const changeActions: ChangeAction[] = [];
    const cellsToCheck = getCellsToCheck();

    cellsToCheck.forEach((currentCell) => {
      const isActive = activeCells.has(currentCell);
      const [x, y, z] = parseCellCoords(currentCell);
      let activeNeighbors = 0;

      for (const xDiff of aroundIterator) {
        for (const yDiff of aroundIterator) {
          for (const zDiff of aroundIterator) {
            if (!(xDiff || yDiff || zDiff)) continue; // current cell

            if (
              activeCells.has(cellCoordStr(x + xDiff, y + yDiff, z + zDiff))
            ) {
              activeNeighbors++;
            }
          }
        }
      }

      if (isActive) {
        // If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
        if (activeNeighbors !== 2 && activeNeighbors !== 3) {
          changeActions.push(() => activeCells.delete(currentCell));
        }
      } else {
        // If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
        if (activeNeighbors === 3) {
          changeActions.push(() => activeCells.add(currentCell));
        }
      }
    });

    changeActions.forEach((changeAction) => changeAction());
    onCycle && (await onCycle(cycleCount, activeCells));

    if (changeActions.length && cycleCount < stopAfterCycles) {
      await cycle();
    }
  }

  // add inactive cells to check, from active cells (all direct neighbors)
  function getCellsToCheck() {
    const cellsToCheck = new Set([...activeCells]);

    activeCells.forEach((cellStr) => {
      const [x, y, z] = parseCellCoords(cellStr);

      for (const xDiff of aroundIterator) {
        for (const yDiff of aroundIterator) {
          for (const zDiff of aroundIterator) {
            if (!(xDiff || yDiff || zDiff)) continue;
            cellsToCheck.add(cellCoordStr(x + xDiff, y + yDiff, z + zDiff));
          }
        }
      }
    });

    return cellsToCheck;
  }

  function cellCoordStr(x = 0, y = 0, z = 0): CellCoordStr {
    return `${[x, y, z].join(",")}`;
  }

  function parseCellCoords(cellCoordStr: CellCoordStr): CellCoord {
    return cellCoordStr.split(",").map((n) => Number(n)) as CellCoord;
  }
}
