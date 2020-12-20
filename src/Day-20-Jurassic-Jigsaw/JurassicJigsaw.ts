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
  const reversingActions = [noop, flipY, flipX];
  const rotationAction = [noop, rotate, rotate, rotate, rotate];
  const tileEdge = getEdgeForConnection(currentTile, connection);

  for (const revAction of reversingActions) {
    revAction();
    for (const rotAction of rotationAction) {
      rotAction();
      for (const revAction2 of reversingActions) {
        revAction2();

        const otherTileEdge = getEdgeForConnection(
          withTile,
          counterConnection(connection)
        );

        if (tileEdge === otherTileEdge) {
          return true;
        }
      }
    }
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

  console.log(`corners`, corners);

  return corners.reduce((acc, tile) => acc * tile.id, 1);
}
