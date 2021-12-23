import { readExampleIntoLines } from "../../utils/readFile";

describe("Day 23: Amphipod", () => {
  test("Part 01 - ...", () => {
    const example = readExampleIntoLines(`
    #############
    #...........#
    ###B#C#B#D###
    ###A#D#C#A###
    #############
  `);
    const input = readExampleIntoLines(`
    #############
    #...........#
    ###D#C#D#B###
    ###C#A#A#B###
    #############
  `);
    expect(solve(example).bestCost).toBe(12521);

    // const result = solve(input);
    // expect(result.bestCost).toBe(14415);
  });

  test("Part 02 - ..", () => {
    const example = readExampleIntoLines(`
      #############
      #...........#
      ###B#C#B#D###
      ###D#C#B#A###
      ###D#B#A#C###
      ###A#D#C#A###
      #############
    `);
    const input = readExampleIntoLines(`
      #############
      #...........#
      ###D#C#D#B###
      ###D#C#B#A###
      ###D#B#A#C###
      ###C#A#A#B###
      #############
    `);
    // expect(solve(example, true).bestCost).toBe(44169);

    const result = solve(input, true);
    expect(result.bestCost).toBe(41121);
  });
});

const stepCost = new Map([
  ["A", 1],
  ["B", 10],
  ["C", 100],
  ["D", 1000],
]);

const goalSideRoomXPerType = new Map([
  ["A", 3],
  ["B", 5],
  ["C", 7],
  ["D", 9],
]);

type Pos = [number, number];
type Pod = {
  type: string;
  at: Pos;
  cost: number;
  costPerStep: number;
  goalSideRoomX: number;
};
type PositionMap = Map<string, string>;
const { min, max, abs } = Math;

function solve(lines: string[], big = false) {
  let bestCost = Infinity;

  const initialState = createState();

  const done = new Set<string>();
  const [roomYFrom, roomYTo]: Pos = big ? [2, 5] : [2, 3];

  lines.forEach((l, y) =>
    l.split("").forEach((char, x) => {
      initialState.map.set(_(x, y), char);
      if (stepCost.has(char)) {
        initialState.pods.push({
          type: char,
          at: [x, y],
          cost: 0,
          costPerStep: stepCost.get(char)!,
          goalSideRoomX: goalSideRoomXPerType.get(char)!,
        });
      }
    })
  );

  let openStates = [initialState];

  play();

  return {
    bestCost,
  };

  function play() {
    while (openStates.length) {
      openStates = openStates.map((s) => ({ ...s, starCost: s.starCost }));
      openStates.sort((a, b) => a.starCost - b.starCost);

      const state = openStates.shift()!;
      const pods = state.pods;
      // const key = state.key;

      // if (done.has(key)) {
      //   // console.log("handles before, doing nothing");
      //   continue;
      // }

      if (state.cost >= bestCost) {
        // console.log("bad shit");
        // done.add(state.key);
        continue;
      }

      const allPodsInGoalSideRoom = pods.every(isInGoalSideRoom);

      if (allPodsInGoalSideRoom) {
        bestCost = min(state.cost, bestCost);
        console.log(`new bestCost`, bestCost, state.cost, state.print());
        // done.add(state.key);
        continue;
      }

      // state.print();
      // done.add(state.key);

      pods.forEach((pod) => {
        if (isInHallway(pod.at)) {
          if (isTargetRoomClear(state.map, pod)) {
            // Pod must into goal side room from hallway
            // Pod should never enter when there is another kind of pod in room
            const targetPos = getSideRoomTarget(state.map, pod);

            const newState = targetPos
              ? goTo(state, pod, targetPos)
              : undefined;
            if (newState) {
              openStates.push(newState);
            }
          }
        } else if (
          isInSideRoomButNotInGoal(pod) ||
          isBlockingOtherTypeInGoalSideRoom(state.map, pod)
        ) {
          // Amphipod must go into hallway, go to all places that are possible
          const emptyPositions = getEmptyHallwaySpots(state.map).filter(
            // entry spots are not possible
            (pos) => !isSideRoomEntry(pos)
          );

          emptyPositions.forEach((targetPos) => {
            // there will be no state if the way is blocked
            const newState = goTo(state, pod, targetPos);
            if (newState) {
              // newState.print();
              openStates.push(newState);
            }
          });
        }
      });

      if (!openStates.length && bestCost === Infinity) {
        throw Error("mhh.");
      }
    }
  }

  type State = ReturnType<typeof createState>;

  function isBlockingOtherTypeInGoalSideRoom(map: PositionMap, pod: Pod) {
    if (!isInGoalSideRoom(pod)) return false;
    // eslint-disable-next-line prefer-const
    let [x, y] = pod.at;
    while (y < roomYTo) {
      y++;
      const below = map.get(_(x, y));
      if (!below || below === "#") throw Error("unexpected below: " + below);
      if (below !== "." && below !== pod.type) {
        return true;
      }
    }
    return false;
  }

  function isTargetRoomClear(map: PositionMap, pod: Pod) {
    const x = pod.goalSideRoomX;
    let y = roomYFrom;
    while (y <= roomYTo) {
      if (!(isEmpty(map, x, y) || isSameType(map, pod, x, y))) {
        return false;
      }
      y++;
    }
    return true;
  }

  function isSameType(map: PositionMap, pod: Pod, x: number, y: number) {
    return map.get(_(x, y)) === pod.type;
  }

  function getSideRoomTarget(
    map: PositionMap,
    { goalSideRoomX }: Pod
  ): Pos | undefined {
    const x = goalSideRoomX;
    let y = roomYTo;

    while (y >= roomYFrom) {
      if (isEmpty(map, x, y)) return [x, y];
      y--;
    }
  }

  function goTo(
    { map, pods }: State,
    pod: Pod,
    [targetX, targetY]: Pos
  ): State | undefined {
    let costToTarget = 0;
    const [startX, startY] = pod.at;
    let [x, y] = pod.at;

    while (x !== targetX || y !== targetY) {
      const [moveX, moveY] = [limitStep(targetX - x), limitStep(targetY - y)];

      if (moveX && isEmpty(map, x + moveX, y)) {
        x += moveX;
        costToTarget += pod.costPerStep;
      } else if (moveY && isEmpty(map, x, y + moveY)) {
        y += moveY;
        costToTarget += pod.costPerStep;
      } else {
        return;
      }
    }

    const otherPods = pods.filter((p) => p !== pod);

    if (otherPods.length !== (big ? 15 : 7))
      throw Error("unexpected pod count:" + otherPods.length);

    const newMap = new Map(map.entries());
    newMap.set(_(startX, startY), ".");
    newMap.set(_(targetX, targetY), pod.type);

    return createState({
      map: newMap,
      pods: [
        ...otherPods,
        {
          ...pod,
          at: [x, y],
          cost: pod.cost + costToTarget,
        },
      ],
    });
  }

  function limitStep(n: number) {
    return max(-1, min(1, n));
  }

  function getEmptyHallwaySpots(map: PositionMap) {
    return Array.from({ length: 11 }, (_, i) => [i + 1, 1] as Pos).filter(
      ([x, y]) => isEmpty(map, x, y)
    );
  }

  function isEmpty(map: PositionMap, x: number, y: number) {
    return map.get(_(x, y)) === ".";
  }

  function isInHallway(at: Pos) {
    const [x, y] = at;
    return y == 1 && x > 0 && x < 12;
  }

  function isSideRoomEntry(at: Pos) {
    return (
      isInHallway(at) && [...goalSideRoomXPerType.values()].includes(at[0])
    );
  }

  function isInSideRoom(at: Pos) {
    const [x, y] = at;
    return (
      y >= roomYFrom &&
      y <= roomYTo &&
      [...goalSideRoomXPerType.values()].includes(x)
    );
  }

  function isInSideRoomButNotInGoal(pod: Pod) {
    return isInSideRoom(pod.at) && !isInGoalSideRoom(pod);
  }

  function isInGoalSideRoom(pod: Pod) {
    const [x] = pod.at;
    return isInSideRoom(pod.at) && x === pod.goalSideRoomX;
  }

  function getKey(map: PositionMap) {
    return mapToLines(map).join("|");
  }

  function mapToLines(map: PositionMap) {
    const arr = Array.from({ length: lines.length }, () => [] as string[]);
    [...map.entries()].forEach(([key, value]) => {
      const [x, y] = key.split(",").map((n) => +n);
      arr[y][x] = value;
    });
    return arr.map((l) => l.join(""));
  }

  function createState({
    pods = [],
    map = new Map(),
  }: {
    pods?: Pod[];
    map?: Map<string, string>;
  } = {}) {
    return {
      map,
      pods,
      print() {
        const printable = mapToLines(map);
        console.log(printable);
        return printable;
      },
      get starCost() {
        return pods.reduce((a, pod) => {
          const [x] = pod.at;
          const distanceCost = abs(x - pod.goalSideRoomX);
          return a + distanceCost;
        }, 0);
      },
      get cost() {
        return pods.reduce((a, b) => a + b.cost, 0);
      },
    };
  }

  function _(...args: unknown[]) {
    return args.join();
  }
}
