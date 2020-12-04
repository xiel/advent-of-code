interface PassportEntry {
  byr: string; // (Birth Year)
  iyr: string; // (Issue Year)
  eyr: string; // (Expiration Year)
  hgt: string; // (Height)
  hcl: string; // (Hair Color)
  ecl: string; // (Eye Color)
  pid: string; // (Passport ID)
  cid: string; // (Country ID)
}

type PassportFieldName = keyof PassportEntry;
type PassportKeyValue = [PassportFieldName, string];

function transformToPassportEntry(passportString: string) {
  return passportString.split(" ").reduce((entryAcc, keyValueString) => {
    const [key, value] = keyValueString.split(":") as PassportKeyValue;
    entryAcc[key] = value;
    return entryAcc;
  }, {} as Partial<PassportEntry>);
}

function parseSeparatePassportStrings(passportBatchFileText: string): string[] {
  return passportBatchFileText
    .split("\n\n")
    .map((passportString) => passportString.replace(/\n/g, " "));
}

function passportsAsEntries(passportStrings: string[]) {
  return passportStrings.map(transformToPassportEntry);
}

function isPassportValid(
  passportEntry: Partial<PassportEntry>,
  requiredPassportFields: PassportFieldName[] = [
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid",
  ]
) {
  return requiredPassportFields.every(
    (fieldName) => !!passportEntry[fieldName]
  );
}

export function countValidPassports(passportBatchFileText: string) {
  const passportEntries = passportsAsEntries(
    parseSeparatePassportStrings(passportBatchFileText)
  );

  const validPassports = passportEntries.filter((passportEntry) =>
    isPassportValid(passportEntry)
  );

  return validPassports.length;
}
