type XAxisRepeatingTreeMap = string[];

interface Slope {
  right: number;
  down: number;
}

const TREE_CHARACTER = "#";

function isTreeAt(
  treeMap: XAxisRepeatingTreeMap,
  x: number,
  y: number
): boolean {
  const mapWidth = treeMap[0].length;
  const overflowCorrectedX = x % mapWidth;
  const mapEntry = treeMap[y][overflowCorrectedX];
  if (mapEntry === undefined) throw new Error("coordinates not on given map");
  return mapEntry === TREE_CHARACTER;
}

export function countTreeEncounters(
  treeMap: XAxisRepeatingTreeMap,
  slope: Slope
) {
  const mapYMax = treeMap.length - 1;
  const currentPos = {
    x: 0,
    y: 0,
  };
  let treeEncounters = 0;

  while (currentPos.y <= mapYMax) {
    if (isTreeAt(treeMap, currentPos.x, currentPos.y)) {
      treeEncounters++;
    }
    currentPos.x += slope.right;
    currentPos.y += slope.down;
  }

  return treeEncounters;
}
