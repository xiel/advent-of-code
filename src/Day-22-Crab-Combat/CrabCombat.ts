export function playCombat(deckStr: string[]) {
  const [playerOne, playerTwo] = deckStr.map((str) =>
    str
      .split("\n")
      .filter(Boolean)
      .slice(1)
      .map((n) => Number(n))
  );

  while (playerOne.length && playerTwo.length) {
    const cardOne = playerOne.shift()!;
    const cardTwo = playerTwo.shift()!;

    if (cardOne > cardTwo) {
      playerOne.push(...[cardOne, cardTwo]);
    } else {
      playerTwo.push(...[cardTwo, cardOne]);
    }
  }

  const winner = playerOne.length ? playerOne : playerTwo;
  const winnerScore = winner.reduceRight(
    (acc, num, i) => acc + num * (winner.length - i),
    0
  );
  return winnerScore;
}
