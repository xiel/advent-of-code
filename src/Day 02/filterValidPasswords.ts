// can be expected to be in format: "1-3 b: cdefg"
type PasswordEntry = string;

function isPasswordValid(passwordEntry: PasswordEntry) {
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

export function filterValidPasswords(entries: PasswordEntry[]) {
  return entries.filter(isPasswordValid);
}
