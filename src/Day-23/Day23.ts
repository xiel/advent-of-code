export function playCrabCups(startingOrder: string | string[], rounds = 10) {
  let cups =
    typeof startingOrder === "string" ? startingOrder.split("") : startingOrder;

  const cupNums = cups.map((n) => parseInt(n));
  const cupsMin = min(cupNums);
  const cupsMax = max(cupNums);

  let currentCupIndex = 0;
  let round = 0;

  while (round < rounds) {
    round++;

    if (round % 100_000 === 0) console.log("round", round);

    const currentCup = cups[currentCupIndex];
    const currentCupValue = parseInt(currentCup);

    // The crab picks up the three cups that are immediately clockwise of the current cup.
    // They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
    const [pickedUpCups, leftOver] = takeOut(3, currentCupIndex + 1, cups);

    cups = leftOver;

    const cupsSet = new Set(cups);

    // The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
    let destinationCupIndex = -1;
    let destinationCupCandidate = currentCupValue;

    while (destinationCupIndex === -1) {
      // If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up.
      destinationCupCandidate--;

      // If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
      if (destinationCupCandidate < cupsMin) {
        destinationCupCandidate = cupsMax;
      }

      if (cupsSet.has(destinationCupCandidate.toString())) {
        destinationCupIndex = cups.indexOf(`${destinationCupCandidate}`);
      } else {
        destinationCupIndex = -1;
      }
    }

    // The crab places the cups it just picked up so that they are immediately clockwise of the destination cup.
    // They keep the same order as when they were picked up.
    cups.splice(destinationCupIndex + 1, 0, ...pickedUpCups);

    // The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
    currentCupIndex = (cups.indexOf(currentCup) + 1) % cups.length;
  }

  const numsAfterOne = takeOut(
    cups.length - 1,
    cups.indexOf("1") + 1,
    cups
  )[0].join("");

  const productOfNextTwo = takeOut(2, cups.indexOf("1") + 1, cups)[0].reduce(
    (acc, n) => acc * parseInt(n),
    1
  );

  return {
    numsAfterOne,
    productOfNextTwo,
  };
}

export function takeOut<T>(count: number, startingAt: number, arr: T[]) {
  const indexesToRemove = new Array(count)
    .fill(0)
    .map((_, i) => (startingAt + i) % arr.length);

  const removedItems: T[] = indexesToRemove.map((i) => arr[i]);

  const indexesToRemoveSet = new Set(indexesToRemove);
  const remaining = arr.filter((_, i) => !indexesToRemoveSet.has(i));

  return [removedItems, remaining];
}

export function prepareOneMillionCups(startingOrder: string) {
  const cups = startingOrder.split("");
  const cupsMax = Math.max(...cups.map((n) => parseInt(n)));
  let i = 0;

  while (cups.length < 1_000_000) {
    i++;
    cups.push(`${cupsMax + i}`);
  }

  console.log(`cups`, cups.length);

  return cups;
}

function min(nums: number[]) {
  let currMin = Infinity;
  for (const num of nums) {
    if (num < currMin) {
      currMin = num;
    }
  }
  return currMin;
}

function max(nums: number[]) {
  let currMax = -Infinity;
  for (const num of nums) {
    if (num > currMax) {
      currMax = num;
    }
  }
  return currMax;
}
