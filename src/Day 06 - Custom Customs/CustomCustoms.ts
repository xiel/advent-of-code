type PersonCustoms = string; // string of a-z, egb. "ab"
type GroupCustoms = PersonCustoms[]; // string of a-z

export function countChoicesInGroups(groups: GroupCustoms[]) {
  return groups.reduce(
    (sum, group) => sum + countDifferentChoicesInGroup(group),
    0
  );
}

// duplicate answers to the same question don't count extra; each question counts at most once
export function countDifferentChoicesInGroup(group: GroupCustoms) {
  const groupChoices = new Set();

  for (const personChoices of group) {
    personChoices.split("").forEach((letter) => groupChoices.add(letter));
  }

  return groupChoices.size;
}
