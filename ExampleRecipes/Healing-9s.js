import { logAddIngredient, logAddSunSalt, logAddStirCauldron, stirToNearestTarget } from "../main";
import { Effects } from "../main";

import { Ingredients } from "@potionous/dataset";

function main() {
  logAddIngredient(Ingredients.Goodberry, 1);
  logAddSunSalt(6);
  logAddStirCauldron(2.635);
  logAddSunSalt(3);
  let bestDistance = stirToNearestTarget(Effects.Water.Healing);
  console.log(bestDistance);
}
