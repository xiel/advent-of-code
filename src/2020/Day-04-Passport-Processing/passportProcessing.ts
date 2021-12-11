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

const requiredPassportFields: PassportFieldName[] = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
];

const validators = {
  //byr (Birth Year) - four digits; at least 1920 and at most 2002.
  byr: (value: string) => {
    const valueAsNumber = Number(value);
    return valueAsNumber >= 1920 && valueAsNumber <= 2002;
  },
  //iyr (Issue Year) - four digits; at least 2010 and at most 2020.
  iyr: (value: string) => {
    const valueAsNumber = Number(value);
    return valueAsNumber >= 2010 && valueAsNumber <= 2020;
  },
  //eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
  eyr: (value: string) => {
    const valueAsNumber = Number(value);
    return valueAsNumber >= 2020 && valueAsNumber <= 2030;
  },
  //hgt (Height) - a number followed by either cm or in:
  //If cm, the number must be at least 150 and at most 193.
  //If in, the number must be at least 59 and at most 76.
  hgt: (value: string) => {
    const unit = value.endsWith("cm") ? "cm" : "in";
    const [unitlessValue] = value.split(unit);
    const valueAsNumber = Number(unitlessValue);

    if (unit === "cm") {
      return valueAsNumber >= 150 && valueAsNumber <= 193;
    } else if (unit === "in") {
      return valueAsNumber >= 59 && valueAsNumber <= 76;
    }
  },
  //hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  hcl: (value: string) => {
    return !!value.match(/#[0-9a-f]{6}$/);
  },

  //ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  ecl: (value: string) => {
    return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value);
  },

  //pid (Passport ID) - a nine-digit number, including leading zeroes.
  pid: (value: string) => {
    return !!value.match(/^\d{9}$/);
  },
  //cid (Country ID) - ignored, missing or not.
  cid: () => true,
};

function isPassportValid(
  passportEntry: Partial<PassportEntry>,
  strict: boolean
) {
  return requiredPassportFields.every((fieldName) => {
    const value = passportEntry[fieldName];

    if (!value) return false;
    if (!strict) return true;

    return validators[fieldName](value);
  });
}

export function countValidPassports(
  passportBatchFileText: string,
  strict = false
): number {
  const passportEntries = passportsAsEntries(
    parseSeparatePassportStrings(passportBatchFileText)
  );

  const validPassports = passportEntries.filter((passportEntry) =>
    isPassportValid(passportEntry, strict)
  );

  return validPassports.length;
}
