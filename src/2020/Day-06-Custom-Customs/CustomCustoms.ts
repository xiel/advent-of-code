type PersonCustoms = string; // string of a-z, egb. "ab"
type GroupCustoms = PersonCustoms[]; // string of a-z

export function countChoicesInGroups(groups: GroupCustoms[]) {
  return groups.reduce(
    (sum, group) => sum + countDifferentChoicesInGroup(group),
    0
  );
}

// duplicate answers to the same question don't count extra; each question counts at most once
function countDifferentChoicesInGroup(group: GroupCustoms) {
  const groupChoices = new Set();

  for (const personChoices of group) {
    personChoices.split("").forEach((letter) => groupChoices.add(letter));
  }

  return groupChoices.size;
}

export function countUnanimousChoicesInGroups(groups: GroupCustoms[]) {
  return groups.reduce(
    (sum, group) => sum + countUnanimousChoicesInGroup(group),
    0
  );
}

function countUnanimousChoicesInGroup(group: GroupCustoms) {
  const [firstPerson, ...restPersons] = group;
  let unanimousChoices = firstPerson.split("");

  for (const person of restPersons) {
    const personChoices = new Set(person.split(""));
    unanimousChoices = unanimousChoices.filter((choice) =>
      personChoices.has(choice)
    );
  }

  return unanimousChoices.length;
}
