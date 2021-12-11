type Ingredient = string;
type Allergen = string;
type IngCandidate = [Allergen, Ingredient[]];

// Each allergen is found in exactly one ingredient.
// Each ingredient contains zero or one allergen.
// Allergens aren't always marked;
export function findAllergenFreeIngredients(ingLists: string[]) {
  const appearancesForAllergens = new Map<Allergen, Map<Ingredient, number>>();
  const totalAppearances = new Map<Ingredient, number>();
  const allergenFreeIngredients = new Set<Ingredient>();

  ingLists.forEach((ingList) => {
    const [ingredientsStr, allergensStr] = ingList.split(" (contains ");
    const ingredients = ingredientsStr.split(" ");
    const allergens = allergensStr.slice(0, -1).split(", ");

    ingredients.forEach((ingredient) => {
      totalAppearances.set(
        ingredient,
        (totalAppearances.get(ingredient) || 0) + 1
      );
      // add all ingredients  to the allegen free list initially
      allergenFreeIngredients.add(ingredient);
    });

    allergens.forEach((allegen) => {
      ingredients.forEach((ingredient) => {
        const map =
          appearancesForAllergens.get(allegen) || new Map<Ingredient, number>();

        map.set(ingredient, (map.get(ingredient) || 0) + 1);
        appearancesForAllergens.set(allegen, map);
      });
    });
  });

  // Find all ingredients that were most often mentioned with a given allergen
  const possibleIngCandidatesForAllergens = [...appearancesForAllergens].map(
    ([allergenName, ingAppearedTimesMap]) => {
      const appearancesMax = Math.max(
        ...[...ingAppearedTimesMap].map(([_, count]) => count)
      );

      const possibleCandidates = [...ingAppearedTimesMap]
        .filter(([_, count]) => count === appearancesMax)
        .map(([ingName]) => ingName);

      possibleCandidates.forEach((ingName) =>
        allergenFreeIngredients.delete(ingName)
      );

      return [allergenName, possibleCandidates] as IngCandidate;
    }
  );

  // Part I:
  // Determine which ingredients cannot possibly contain any of the allergens in your list.
  // How many times do any of those ingredients appear?
  const appearanceCountOfAllergenFreeIngredients = [
    ...allergenFreeIngredients,
  ].reduce((acc, name) => acc + totalAppearances.get(name)!, 0);

  // Part II:
  // Time to stock your raft with supplies. What is your canonical dangerous ingredient list?
  const finalAllergenToIngList: IngCandidate[] = [];
  const unassignedAllergenToIngList = new Set(
    possibleIngCandidatesForAllergens
  );

  while (unassignedAllergenToIngList.size) {
    // we can be sure about a allergen matching only one ingredient
    const finalCandidate = [...unassignedAllergenToIngList].find(
      (entry) => entry[1].length === 1
    );

    if (!finalCandidate)
      throw Error("unable to resolve, missing foundFinalCandidate");

    finalAllergenToIngList.push(finalCandidate);
    unassignedAllergenToIngList.delete(finalCandidate);

    // Remove the matched ingredient from all other ingredient lists
    [...unassignedAllergenToIngList].forEach((entry) => {
      entry[1] = entry[1].filter((ing) => ing !== finalCandidate[1][0]);
    });
  }

  // Arrange the ingredients alphabetically by their allergen and separate them by commas
  const canonicalDangerousIngredientList = finalAllergenToIngList
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map((e) => e[1])
    .join(",");

  return {
    appearanceCountOfAllergenFreeIngredients,
    canonicalDangerousIngredientList,
  };
}
