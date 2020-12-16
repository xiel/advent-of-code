import { gameOfSeatingSystem, SeatMap } from "./GameOfSeatingSystem";
import list from "./input";

let newRules = false;
let stop = start();

document.addEventListener("dblclick", () => {
  stop();
  newRules = !newRules;
  stop = start();
});

function start() {
  const frames: SeatMap[] = [];
  const splitSeats = list
    .split("\n")
    .filter(Boolean)
    .map((row) => row.split(""));

  let rafID = requestAnimationFrame(renderNextFrame);
  let timeoutID = -1;

  function renderNextFrame() {
    const frame = frames.shift();

    if (frame) {
      document.body.innerHTML = frame.map((row) => row.join("")).join("<br/>");

      timeoutID = Number(
        setTimeout(() => {
          rafID = requestAnimationFrame(renderNextFrame);
        }, 250)
      );
    }
  }

  gameOfSeatingSystem(splitSeats, newRules, (map) => frames.push(map), true);

  return () => {
    clearTimeout(timeoutID);
    cancelAnimationFrame(rafID);
  };
}
