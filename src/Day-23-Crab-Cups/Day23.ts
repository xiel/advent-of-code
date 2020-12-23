interface Cup {
  value: number;
  valueStr: string;
  next: Cup;
  prev: Cup;
}

export function playCrabCups(startingOrder: string | string[], rounds = 10) {
  const cupStrs =
    typeof startingOrder === "string" ? startingOrder.split("") : startingOrder;
  const cupNums = cupStrs.map((n) => parseInt(n));
  const cupsMin = min(cupNums);
  const cupsMax = max(cupNums);
  const cups = makeCups(cupNums);
  let currentCup = cups.get(cupNums[0])!;

  let round = 0;
  while (round < rounds) {
    round++;
    if (round % 1_000_000 === 0) console.log(`Round #${round}`);

    // The crab picks up the three cups that are immediately clockwise of the current cup.
    const pickedUpCups = [
      currentCup.next,
      currentCup.next.next,
      currentCup.next.next.next,
    ];

    // They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
    const lastPickedUpCup = pickedUpCups[pickedUpCups.length - 1];
    currentCup.next = lastPickedUpCup.next;
    lastPickedUpCup.next.prev = currentCup;

    // The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
    let destinationCupCandidateValue = currentCup.value - 1;

    // If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up.
    while (
      !cups.has(destinationCupCandidateValue) ||
      pickedUpCups.find((c) => c.value === destinationCupCandidateValue)
    ) {
      destinationCupCandidateValue--;

      // If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
      if (destinationCupCandidateValue < cupsMin) {
        destinationCupCandidateValue = cupsMax;
      }
    }

    const destinationCup = cups.get(destinationCupCandidateValue);

    if (!destinationCup) throw Error("destination cup not found");

    // The crab places the cups it just picked up so that they are immediately clockwise of the destination cup.
    // They keep the same order as when they were picked up.
    const afterInsertCup = destinationCup.next;

    // connect start of the picked up cups
    destinationCup.next = pickedUpCups[0];
    pickedUpCups[0].prev = destinationCup;

    // connect end of the picked up cups
    pickedUpCups[pickedUpCups.length - 1].next = afterInsertCup;
    afterInsertCup.prev = pickedUpCups[pickedUpCups.length - 1];

    // The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
    currentCup = currentCup.next;
  }

  const cupOne = cups.get(1)!;
  let numsAfterOne = "";
  let current: Cup = cupOne;

  while (current.next !== cupOne) {
    current = current.next;
    numsAfterOne += current.valueStr;
  }

  const productOfNextTwo = cupOne.next.value * cupOne.next.next.value;

  return {
    numsAfterOne,
    productOfNextTwo,
  };
}

function makeCups(cupNums: number[]) {
  const cupsMap = new Map<number, Cup>();
  let prev: Cup | undefined;

  // build chain of cups nodes
  const cups = cupNums.map((value) => {
    const cup = {
      value,
      valueStr: value.toString(),
      prev,
    } as Cup;

    if (prev) {
      prev.next = cup;
    }

    prev = cup;
    return cup;
  });

  // connect first and last
  cups[cups.length - 1].next = cups[0];
  cups[0].prev = cups[cups.length - 1];

  cups.forEach((cup) => cupsMap.set(cup.value, cup));

  return cupsMap;
}

export function prepareOneMillionCups(startingOrder: string) {
  const cups = startingOrder.split("");
  const cupsMax = Math.max(...cups.map((n) => parseInt(n)));
  let i = 0;

  while (cups.length < 1_000_000) {
    i++;
    cups.push(`${cupsMax + i}`);
  }

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
