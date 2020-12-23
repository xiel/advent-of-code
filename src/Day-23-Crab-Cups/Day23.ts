interface Cup {
  value: number;
  next: Cup;
}

export function playCrabCups(startingOrder: string | string[], rounds = 10) {
  const cupStrs =
    typeof startingOrder === "string" ? startingOrder.split("") : startingOrder;
  const cupNums = cupStrs.map((n) => parseInt(n));
  const { cups, min, max } = makeCups(cupNums);
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

    // The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
    let destinationCupCandidateValue = currentCup.value - 1;

    // If this would select one of the cups that was just picked up,
    // the crab will keep subtracting one until it finds a cup that wasn't just picked up.
    while (
      !cups.has(destinationCupCandidateValue) ||
      pickedUpCups.find((c) => c.value === destinationCupCandidateValue)
    ) {
      destinationCupCandidateValue--;

      // If at any point in this process the value goes below the lowest value on any cup's label,
      // it wraps around to the highest value on any cup's label instead.
      if (destinationCupCandidateValue < min) {
        destinationCupCandidateValue = max;
      }
    }

    const destinationCup = cups.get(destinationCupCandidateValue);

    if (!destinationCup) throw Error("destination cup not found");

    // The crab places the cups it just picked up so that they are immediately clockwise of the destination cup.
    // They keep the same order as when they were picked up.
    const afterInsertCup = destinationCup.next;

    // connect start of the picked up cups
    destinationCup.next = pickedUpCups[0];

    // connect end of the picked up cups
    pickedUpCups[pickedUpCups.length - 1].next = afterInsertCup;

    // The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
    currentCup = currentCup.next;
  }

  const cupOne = cups.get(1)!;
  let numsAfterOne = "";
  let current: Cup = cupOne;

  while (current.next !== cupOne) {
    current = current.next;
    numsAfterOne += current.value;
  }

  const productOfNextTwo = cupOne.next.value * cupOne.next.next.value;

  return {
    numsAfterOne,
    productOfNextTwo,
  };
}

function makeCups(cupNums: number[]) {
  const cupsMap = new Map<number, Cup>();
  let min = Infinity;
  let max = -Infinity;

  let prev: Cup | undefined;

  // build chain of cups nodes
  const cups = cupNums.map((value) => {
    const cup: Cup = {
      value,
      next: null as never,
    };

    if (prev) {
      prev.next = cup;
    }

    prev = cup;
    cupsMap.set(cup.value, cup);

    if (value > max) {
      max = value;
    }
    if (value < min) {
      min = value;
    }

    return cup;
  });

  // connect last to first
  cups[cups.length - 1].next = cups[0];

  return { cups: cupsMap, min, max };
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
