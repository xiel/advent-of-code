// can be expected to be in format: "1-3 b: cdefg"
type PasswordEntry = string;

export function isValidPasswordValidSledRentalPlace(
  passwordEntry: PasswordEntry
): boolean {
  const [occurrenceRangeString, letter, password] = passwordEntry
    .replace(":", "")
    .split(" ");

  const [minOccurrence, maxOccurrence] = occurrenceRangeString
    .split("-")
    .map((numberStr) => parseInt(numberStr));

  let foundOccurrences = 0;

  for (const currentLetter of password) {
    if (currentLetter === letter) {
      foundOccurrences += 1;
    }
  }

  return foundOccurrences >= minOccurrence && foundOccurrences <= maxOccurrence;
}

export function isValidPasswordValidTobogganCorporatePolicy(
  passwordEntry: PasswordEntry
): boolean {
  const [occurrenceRangeString, letter, password] = passwordEntry
    .replace(":", "")
    .split(" ");

  // get index, string is not zero index based, so we subtract 1 to make it so
  const [pos1, pos2] = occurrenceRangeString
    .split("-")
    .map((numberStr) => parseInt(numberStr) - 1);

  const posOneMatches = password[pos1] === letter;
  const posTwoMatches = password[pos2] === letter;

  // only one must be true, not both!
  return (posOneMatches || posTwoMatches) && posOneMatches !== posTwoMatches;
}

export function filterValidPasswords(
  entries: PasswordEntry[],
  filterFn: (password: PasswordEntry) => boolean
) {
  return entries.filter(filterFn);
}
