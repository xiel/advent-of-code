type Coord = [number, number];

const Dir = {
  e: [1, 0] as Coord,
  w: [-1, 0] as Coord,
  se: [0.5, 0.5] as Coord,
  sw: [-0.5, 0.5] as Coord,
  nw: [-0.5, -0.5] as Coord,
  ne: [0.5, -0.5] as Coord,
};

function add(xy: Coord, xy2: Coord): Coord {
  return [xy[0] + xy2[0], xy[1] + xy2[1]];
}

export function lobbyLayout(lines: string[], livingArtDays = 0) {
  const isBlackSet = new Set<string>();

  // Part 1 - follow path, last coord is the tile this instruction line flips
  lines.forEach((line) => {
    let lineXY: Coord = [0, 0];
    let i = 0;

    while (i < line.length) {
      const currentHead1 = line[i];
      const currentHead2 = line[i] + line[i + 1];

      switch (currentHead1) {
        case "e":
        case "w":
          lineXY = add(lineXY, Dir[currentHead1]);
          i++;
          continue;
      }
      switch (currentHead2) {
        case "se":
        case "sw":
        case "nw":
        case "ne":
          lineXY = add(lineXY, Dir[currentHead2]);
          i += 2;
          break;
        default:
          throw Error("unexpected non match");
      }
    }

    const key = lineXY.join("|");

    if (isBlackSet.has(key)) {
      isBlackSet.delete(key);
    } else {
      isBlackSet.add(key);
    }
  });

  livingArtDays && livingArt(isBlackSet, livingArtDays);

  return isBlackSet.size;
}

// Part II
type ChangeAction = () => void;

function livingArt(blackTilesSet: Set<string>, livingArtDays = 0) {
  const dirs = Object.values(Dir);

  let day = 0;
  while (day < livingArtDays) {
    day++;

    const tilesToCheck = getTilesToCheck(blackTilesSet);
    const changeActions: ChangeAction[] = [];

    tilesToCheck.forEach((tile) => {
      const tileKey = tile.join("|");
      const isBlack = blackTilesSet.has(tileKey);
      const blackTileNeighbors = dirs.reduce(
        (acc, dirDiff) =>
          acc + (blackTilesSet.has(add(tile, dirDiff).join("|")) ? 1 : 0),
        0
      );

      if (isBlack) {
        // Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
        if (blackTileNeighbors === 0 || blackTileNeighbors > 2) {
          changeActions.push(() => blackTilesSet.delete(tileKey));
        }
      } else {
        // Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
        if (blackTileNeighbors === 2) {
          changeActions.push(() => blackTilesSet.add(tileKey));
        }
      }
    });

    changeActions.forEach((changeAction) => changeAction());

    if (!changeActions.length) {
      break;
    }
  }

  return blackTilesSet;
}

function getTilesToCheck(blackTiles: Set<string>) {
  const tilesToCheckSet = new Set<string>();
  const tilesToCheckEntries: Coord[] = [];
  const dirs = Object.values(Dir);

  [...blackTiles].forEach((tileKey) => {
    const [x, y] = tileKey.split("|").map((n) => parseFloat(n)) as Coord;

    if (!tilesToCheckSet.has(tileKey)) {
      tilesToCheckSet.add(tileKey);
      tilesToCheckEntries.push([x, y]);
    }

    dirs.forEach((dirDiff) => {
      const aroundXY = add([x, y], dirDiff);
      const aroundKey = aroundXY.join("|");

      if (!tilesToCheckSet.has(aroundKey)) {
        tilesToCheckSet.add(aroundKey);
        tilesToCheckEntries.push(aroundXY);
      }
    });
  });

  return tilesToCheckEntries;
}
