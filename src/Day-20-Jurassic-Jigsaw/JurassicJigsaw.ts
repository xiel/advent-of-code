type Tile = {
  id: number;
  data: TileData;
  connections: TileConnections;
  flipX(): void;
  flipY(): void;
  rotate(): void;
  topEdge(): string;
  rightEdge(): string;
  leftEdge(): string;
  bottomEdge(): string;
};
type TileConnections = [MaybeTile, MaybeTile, MaybeTile, MaybeTile];
type MaybeTile = Tile | undefined;
type TileData = string[][]; // of same length

enum Connection {
  top,
  right,
  bottom,
  left,
}

function counterConnection(connection: Connection): Connection {
  switch (connection) {
    case Connection.top:
      return Connection.bottom;
    case Connection.right:
      return Connection.left;
    case Connection.bottom:
      return Connection.top;
    case Connection.left:
      return Connection.right;
  }
}

function getEdgeForConnection(tile: Tile, connection: Connection): string {
  switch (connection) {
    case Connection.top:
      return tile.topEdge();
    case Connection.right:
      return tile.rightEdge();
    case Connection.bottom:
      return tile.bottomEdge();
    case Connection.left:
      return tile.leftEdge();
  }
}

function deepFreeze<T>(o: T) {
  if (Object.isFrozen(o)) return o;
  Object.values(o).forEach((o2) => deepFreeze(o2));
  return Object.freeze(o);
}

export function parseTile(tileStr: string): Tile {
  const [idPart, ...dataPart] = tileStr.split("\n");
  const id = Number(idPart.match(/\d+/));
  const hasActiveConnection = () => tile.connections.filter(Boolean).length;
  const tile: Tile = {
    id,
    connections: new Array(4).fill(undefined) as TileConnections,
    data: deepFreeze(dataPart.filter(Boolean).map((d) => d.split(""))),
    flipX,
    flipY,
    rotate,
    topEdge,
    rightEdge,
    leftEdge,
    bottomEdge,
  };

  const widthHeight =
    tile.data.length === tile.data[0].length ? tile.data.length : NaN;

  if (isNaN(widthHeight)) {
    throw Error("need squares");
  }

  function dataCopy() {
    return [...tile.data.map((s) => [...s])];
  }

  function flipX() {
    if (hasActiveConnection()) throw Error("tile connected");
    tile.data = deepFreeze(dataCopy().map((s) => s.reverse()));
  }

  function flipY() {
    if (hasActiveConnection()) throw Error("tile connected");
    tile.data = deepFreeze(dataCopy().reverse());
  }

  // rotate 90 deg left
  function rotate() {
    if (hasActiveConnection()) throw Error("tile connected");
    tile.data = tile.data.map((s, y) =>
      s.map((_, x) => tile.data[x][widthHeight - 1 - y])
    );
  }

  function topEdge() {
    return tile.data[0].join("");
  }

  function rightEdge() {
    return tile.data.map((l) => l[widthHeight - 1]).join("");
  }

  function leftEdge() {
    return tile.data.map((l) => l[0]).join("");
  }

  function bottomEdge() {
    return tile.data[widthHeight - 1].join("");
  }

  return tile;
}

const noop = () => {
  // ...
};

function doConnect(currentTile: Tile, connection: Connection, withTile: Tile) {
  const { flipX, flipY, rotate } = withTile;
  const flipActions = [noop, flipY, flipX];
  const rotationAction = [noop, rotate, rotate, rotate, rotate];
  const tileEdge = getEdgeForConnection(currentTile, connection);

  for (const revAction of flipActions) {
    revAction();
    for (const rotAction of rotationAction) {
      rotAction();

      const otherTileEdge = getEdgeForConnection(
        withTile,
        counterConnection(connection)
      );

      if (tileEdge === otherTileEdge) {
        return true;
      }
    }
    revAction();
  }

  return false;
}

export function fixImageTiles(tilesStrs: string[]) {
  const allTiles = tilesStrs.map((t) => parseTile(t));
  const unconnectedTiles = new Set([...allTiles]);
  const checkedAround = new Set<Tile>();
  const connectedTiles: Tile[] = [];

  const currentTile = allTiles[0];
  connectedTiles.push(currentTile);
  unconnectedTiles.delete(currentTile);

  checkForTilesAround(currentTile);
  resolveInterConnections();

  if (connectedTiles.length !== allTiles.length) {
    throw Error("some tiles did not connect");
  }

  function checkForTilesAround(tile: Tile) {
    if (checkedAround.has(tile)) return;

    checkedAround.add(tile);

    tile.connections = tile.connections.map(
      (hasTile, connectionI: Connection) => {
        if (hasTile) return hasTile;

        const foundTile = [...unconnectedTiles].find((ucTile) =>
          doConnect(tile, connectionI, ucTile)
        );

        if (foundTile) {
          connectedTiles.push(foundTile);
          unconnectedTiles.delete(foundTile);

          foundTile.connections[counterConnection(connectionI)] = tile;

          return foundTile;
        }
      }
    ) as TileConnections;

    if (unconnectedTiles.size) {
      tile.connections.forEach(
        (newTile) => newTile && checkForTilesAround(newTile)
      );
    }
  }

  function resolveInterConnections() {
    connectedTiles.forEach((tile) => {
      tile.connections = tile.connections.map(
        (hasTile, connection: Connection) => {
          if (hasTile) return hasTile;

          const tileEdge = getEdgeForConnection(tile, connection);
          const counterC = counterConnection(connection);

          const foundTile = connectedTiles.find((otherTile) => {
            if (otherTile === tile) return;
            const otherTileEdge = getEdgeForConnection(otherTile, counterC);
            if (otherTileEdge === tileEdge) {
              return true;
            }
          });

          if (foundTile) {
            foundTile.connections[counterC] = tile;
            return foundTile;
          }
        }
      ) as TileConnections;
    });
  }

  return connectedTiles;
}

// What do you get if you multiply together the IDs of the four corner tiles?
export function productOfCornerTiles(connectedTiles: Tile[]) {
  const corners = connectedTiles.filter(
    (tile) => tile.connections.filter(Boolean).length === 2
  );

  if (corners.length !== 4)
    throw Error(
      "looks like we have too many tiles connected to only 2 other tiles"
    );

  return corners.reduce((acc, tile) => acc * tile.id, 1);
}

const seaMonster = `
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
`;

type ImageData = string[][];
type Coord = [number, number];

function parsePattern(patternStr: string) {
  const hashCoords: Coord[] = [];
  const patternLines = patternStr.split("\n").filter(Boolean);

  patternLines.forEach((line, y) => {
    for (const [x, entry] of Object.entries(line)) {
      if (entry === "#") {
        hashCoords.push([Number(x), y]);
      }
    }
  });

  const patternWidth = patternLines[0].length;
  const patternHeight = patternLines.length;
  const patternChars = hashCoords.length;

  const matchPattern = ([fromX, fromY]: Coord, image: ImageData) => {
    return hashCoords.every(([x, y]) => {
      return image[fromY + y][fromX + x] === "#";
    });
  };

  return { matchPattern, patternWidth, patternHeight, patternChars };
}

function noopImage(data: ImageData) {
  return data;
}

function flipX(data: ImageData) {
  return data.map((s) => [...s].reverse());
}

function flipY(data: ImageData) {
  return [...data].reverse();
}

function rotate(data: ImageData) {
  const widthHeight = data.length === data[0].length ? data.length : NaN;
  return data.map((s, y) => s.map((_, x) => data[x][widthHeight - 1 - y]));
}

export function calcWaterRoughness(connectedTiles: Tile[]): number {
  const tilesWidthHeight = Math.sqrt(connectedTiles.length);
  const newTiles = connectedTiles.map((tile) => {
    // remove first and last row & remove first and last char per line
    const data = tile.data.slice(1, -1).map((row) => row.slice(1, -1));
    return {
      ...tile,
      data,
      originalData: tile.data,
    } as Tile;
  });

  const topLeftTile = newTiles.find(
    (t) => !t.connections[Connection.top] && !t.connections[Connection.left]
  );

  if (!topLeftTile) throw Error("no top left tile");

  const tileSize = newTiles[0].data[0].length;
  const imageSize = tilesWidthHeight * tileSize;

  let image = new Array<string[]>(imageSize).fill(
    new Array<string>(imageSize).fill("")
  );

  // add image data via right and bottom connections to final image
  const addedToImageSet = new Set<Tile>();

  addTileToImage(topLeftTile, [0, 0]);

  function addTileToImage(tile: Tile, startFillAt: [number, number]) {
    if (addedToImageSet.has(tile)) return;
    addedToImageSet.add(tile);

    const [startX, startY] = startFillAt;

    image = image.map((row, imageY) =>
      row.map((p, imageX) => {
        const ret = p || "-";

        if (imageX < startX || imageX > startX + tileSize - 1) return ret;
        if (imageY < startY || imageY > startY + tileSize - 1) return ret;

        // project image x,y to tile x,y by subtracting the start indexes
        const [projX, projY] = [imageX - startX, imageY - startY];

        const tileDataAtPoint = tile.data[projY][projX];

        if (!tileDataAtPoint) throw Error("unable to read tile at point");

        return tileDataAtPoint;
      })
    );

    const nextRightTileId = tile.connections[Connection.right]?.id;
    const nextBottomTileId = tile.connections[Connection.bottom]?.id;

    if (nextBottomTileId) {
      addTileToImage(newTiles.find((t) => t.id === nextBottomTileId)!, [
        startX,
        startY + tileSize,
      ]);
    }
    if (nextRightTileId) {
      addTileToImage(newTiles.find((t) => t.id === nextRightTileId)!, [
        startX + tileSize,
        startY,
      ]);
    }
  }

  deepFreeze(image);

  const {
    matchPattern,
    patternWidth,
    patternHeight,
    patternChars,
  } = parsePattern(seaMonster);

  const maxX = imageSize - patternWidth - 1;
  const maxY = imageSize - patternHeight - 1;

  function countMonsters(img: ImageData) {
    let currentImg = img;

    const flipActions = [noopImage, flipY, flipX];
    const rotationAction = [noopImage, rotate, rotate, rotate, rotate];

    for (const flipAction of flipActions) {
      currentImg = flipAction(currentImg);

      for (const rotAction of rotationAction) {
        currentImg = rotAction(currentImg);

        let monstersFound = 0;
        for (let y = 0; y <= maxY; y++) {
          for (let x = 0; x <= maxX; x++) {
            if (matchPattern([x, y], currentImg)) {
              monstersFound++;
            }
          }
        }

        if (monstersFound) {
          console.log(currentImg.map((r) => r.join("")));

          return monstersFound;
        }
      }
    }

    return 0;
  }

  const monstersFound = countMonsters(image);
  const monstersChars = patternChars * monstersFound;
  const roughWaterChars = image
    .flatMap((r) => r)
    .reduce((acc, char) => (char === "#" ? acc + 1 : acc), 0);

  return roughWaterChars - monstersChars;
}
