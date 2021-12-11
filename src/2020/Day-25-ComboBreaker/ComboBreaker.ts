function encryptLoop({
  loopSize = Infinity,
  subjectNumber,
  searchValue,
}: {
  subjectNumber: number;
  loopSize?: number;
  searchValue?: number;
}) {
  let loop = 0;
  let value = 1;

  while (loop < loopSize) {
    loop++;
    value *= subjectNumber;
    value %= 20201227;

    if (searchValue && value === searchValue) {
      return { loopSize: loop, value };
    }
  }

  return {
    loopSize,
    value,
  };
}

export function findEncryptionKey(cardKey: number, doorKey: number) {
  const door = encryptLoop({ subjectNumber: 7, searchValue: doorKey });
  const encryptionKey = encryptLoop({
    subjectNumber: cardKey,
    loopSize: door.loopSize,
  });

  return encryptionKey.value;
}
