import { readExampleIntoLines } from "../../utils/readFile";

describe("Day 23: Amphipod", () => {
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

  test("Part 01 - ...", () => {
    // expect(solve(example).bestCost).toBe(12521);

    const result = solve(input);
    expect(result.bestCost).toBeGreaterThan(14361);
    expect(result.bestCost).toBeLessThan(14532);
    expect(result.bestCost).toBeLessThan(14442);
    expect(result.bestCost).toBe(14415);
  });

  test.skip("Part 02 - ..", () => {
    // ...
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
const { min, max, abs, floor, ceil, round } = Math;

function solve(lines: string[]) {
  let bestCost = Infinity;

  const initialState = createState();

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

      // console.log("----------", state.cost);
      // state.print();

      if (state.cost >= bestCost) continue;

      const allPodsInGoalSideRoom = pods.every(isInGoalSideRoom);

      if (allPodsInGoalSideRoom) {
        bestCost = min(state.cost, bestCost);
        console.log(`bestCost`, bestCost, state.cost, state.print());
        continue;
      }

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
    const [x, y] = pod.at;
    const below = map.get(_(x, y + 1));
    return (
      isInGoalSideRoom(pod) && y === 2 && below !== "." && below !== pod.type
    );
  }

  function isTargetRoomClear(map: PositionMap, pod: Pod) {
    return (
      (isEmpty(map, pod.goalSideRoomX, 2) ||
        isSameType(map, pod, pod.goalSideRoomX, 2)) &&
      (isEmpty(map, pod.goalSideRoomX, 3) ||
        isSameType(map, pod, pod.goalSideRoomX, 3))
    );
  }

  function isSameType(map: PositionMap, pod: Pod, x: number, y: number) {
    return map.get(_(x, y)) === pod.type;
  }

  function getSideRoomTarget(
    map: PositionMap,
    { goalSideRoomX }: Pod
  ): Pos | undefined {
    // Always go as far into the goal side room as possible, if deep spot not empty take the upper spot
    if (isEmpty(map, goalSideRoomX, 3)) return [goalSideRoomX, 3];
    if (isEmpty(map, goalSideRoomX, 2)) return [goalSideRoomX, 2];
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

    if (otherPods.length !== 7)
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
    return (y == 2 || y == 3) && [...goalSideRoomXPerType.values()].includes(x);
  }

  function isInSideRoomButNotInGoal(pod: Pod) {
    return isInSideRoom(pod.at) && !isInGoalSideRoom(pod);
  }

  function isInGoalSideRoom(pod: Pod) {
    const [x] = pod.at;
    return isInSideRoom(pod.at) && x === pod.goalSideRoomX;
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
        const arr = Array.from({ length: 5 }, () => [] as string[]);
        [...map.entries()].forEach(([key, value]) => {
          const [x, y] = key.split(",").map((n) => +n);
          arr[y][x] = value;
        });
        const printable = arr.map((l) => l.join(""));
        console.log(printable);
        return printable;
      },
      get starCost() {
        // const cost = pods.reduce((a, b) => a + b.cost, 0);
        const distanceToTargetCost = pods.reduce((a, pod) => {
          const [x] = pod.at;
          const distanceCost = abs(x - pod.goalSideRoomX);
          // const distanceCostWeighed = distanceCost + (distanceCost * pod.costPerStep) / 1000;
          return a + distanceCost;
        }, 0);

        return distanceToTargetCost;
      },
      get cost() {
        return pods.reduce((a, b) => a + b.cost, 0);
      },
    };
  }

  function deepCopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }

  function _(...args: unknown[]) {
    return args.join();
  }
}
