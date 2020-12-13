// @ts-expect-error - currently no txt types
import seatsFile from "../test/fixtures/input.txt";
import { gameOfSeatingSystem, SeatMap } from "./GameOfSeatingSystem";

fetch(seatsFile)
  .then((res) => res.text())
  .then((list) => {
    const splitSeats = list
      .split("\n")
      .filter(Boolean)
      .map((row) => row.split(""));

    const frames: SeatMap[] = [];

    gameOfSeatingSystem(splitSeats, false, (map) => frames.push(map));
    renderNextFrame();

    function renderNextFrame() {
      const frame = frames.shift();

      if (frame) {
        requestAnimationFrame(() => {
          document.body.innerHTML = frame
            .map((row) => row.join(""))
            .join("<br/>");

          setTimeout(() => renderNextFrame(), 100);
        });
      }
    }
  })
  .catch(console.error);
