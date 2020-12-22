import { getCards } from "./CrabCombat";

// Part II
type Winner = "one" | "two";

export function startRecursiveCombat(deckStr: string[]) {
  const [playerOneStart, playerTwoStart] = getCards(deckStr);
  const { winner, playerOne, playerTwo } = playRecursiveCombat([
    [...playerOneStart],
    [...playerTwoStart],
  ]);
  const winnerDeck = winner === "one" ? playerOne : playerTwo;
  return winnerDeck.reduceRight(
    (acc, num, i) => acc + num * (winnerDeck.length - i),
    0
  );
}

function playRecursiveCombat([playerOne, playerTwo]: [number[], number[]]) {
  const seenDecks = new Set<string>();
  let winner!: Winner;

  while (playerOne.length && playerTwo.length) {
    const decksKey = `${playerOne.join()}-${playerTwo.join()}`;

    // Before either player deals a card, if there was a previous round in this game that had exactly the same cards in the same order in the same players' decks, the game instantly ends in a win for player 1.
    if (seenDecks.has(decksKey)) {
      winner = "one";
      break;
    }

    seenDecks.add(decksKey);

    const cardOne = playerOne.shift()!;
    const cardTwo = playerTwo.shift()!;

    //If both players have at least as many cards remaining in their deck as the value of the card they just drew,
    // the winner of the round is determined by playing a new game of Recursive Combat (see below).
    if (playerOne.length >= cardOne && playerTwo.length >= cardTwo) {
      const { winner } = playRecursiveCombat([
        playerOne.slice(0, cardOne),
        playerTwo.slice(0, cardTwo),
      ]);

      if (!winner) throw Error("no winner");
      if (winner === "one") {
        playerOne.push(...[cardOne, cardTwo]);
      } else {
        playerTwo.push(...[cardTwo, cardOne]);
      }
    } else {
      // Otherwise, at least one player must not have enough cards left in their deck to recurse;
      // the winner of the round is the player with the higher-value card.
      if (cardOne === cardTwo) throw Error("must not be equal");
      if (cardOne > cardTwo) {
        playerOne.push(...[cardOne, cardTwo]);
      } else {
        playerTwo.push(...[cardTwo, cardOne]);
      }
    }
  }

  if (!winner) {
    winner = playerOne.length ? "one" : "two";
  }

  return {
    winner,
    playerOne,
    playerTwo,
  };
}
