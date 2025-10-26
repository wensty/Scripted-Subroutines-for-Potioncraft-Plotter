import {
  createAddIngredient,
  createAddSunSalt,
  createPourSolvent,
  createStirCauldron,
  stirIntoVortex,
} from "../mainScript";

import { Ingredients } from "@potionous/dataset";

function virtualStirToVortex() {
  let minTotalStir = Infinity;
  let optimalStir;
  let d = 0;
  for (d = 5; d < 5.5; d += 0.01) {
    const d2 = stirIntoVortex(5.0, {
      recipeItems: [
        createAddSunSalt(20),
        createAddIngredient(Ingredients.PhantomSkirt, 1.0),
        createStirCauldron(d),
        createPourSolvent(Infinity),
      ],
      virtual: true,
    }).distance;
    if (d + d2 < minTotalStir) {
      minTotalStir = d + d2;
      optimalStir = d2;
    }
  }

  console.log(optimalStir);
}
