export function lobbyLayout(lines: string[]) {
  const isBlackSet = new Set();

  // follow path, last item is the tile this instruction addresses
  lines.forEach((line) => {
    let [x, y] = [0, 0];
    let i = 0;

    while (i < line.length) {
      const currentHead1 = line[i];
      const currentHead2 = line[i] + line[i + 1];

      // e,  w,
      switch (currentHead1) {
        case "e":
          x++;
          i++;
          continue;
        case "w":
          x--;
          i++;
          continue;
      }

      // se, sw, nw, ne
      switch (currentHead2) {
        case "se":
          x += 0.5;
          y += 0.5;
          i += 2;
          break;
        case "sw":
          x -= 0.5;
          y += 0.5;
          i += 2;
          break;
        case "nw":
          x -= 0.5;
          y -= 0.5;
          i += 2;
          break;
        case "ne":
          x += 0.5;
          y -= 0.5;
          i += 2;
          break;
        default:
          throw Error("unexpected non match");
      }
    }

    const key = [x, y].join();

    if (isBlackSet.has(key)) {
      isBlackSet.delete(key);
    } else {
      isBlackSet.add(key);
    }
  });

  return isBlackSet.size;
}
