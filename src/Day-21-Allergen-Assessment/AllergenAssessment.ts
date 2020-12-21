// Each allergen is found in exactly one ingredient.
// Each ingredient contains zero or one allergen.
// Allergens aren't always marked;
// Determine which ingredients cannot possibly contain any of the allergens in your list.
// How many times do any of those ingredients appear?
type Ingredient = string;
type Allergen = string;

// In the above example, none of the ingredients:
// kfcds, nhms, sbzzf, or trh
// can contain an allergen.
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
      // add all ings initially to the "free" list
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

  [...appearancesForAllergens].forEach(([_, ingAppearedTimesMap]) => {
    const appearancesMax = Math.max(
      ...[...ingAppearedTimesMap].map(([_, count]) => count)
    );

    [...ingAppearedTimesMap].forEach(([ingName, count]) => {
      if (count === appearancesMax) {
        allergenFreeIngredients.delete(ingName);
      }
    });
  });

  return [...allergenFreeIngredients].reduce(
    (acc, name) => acc + totalAppearances.get(name)!,
    0
  );
}
