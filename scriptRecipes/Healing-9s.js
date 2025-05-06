// Wrapped ingredient and salt instructions.
import { logAddIngredient, logAddSunSalt } from "../main";
// Wrapped operation instructions.
import { logAddStirCauldron } from "../main";

function main() {
  logAddIngredient(Ingredients.Goodberry, 1);
  logAddSunSalt(6);
  logAddStirCauldron(2.635);
  logAddSunSalt(3);
  let bestDistance = stirToNearestTarget(3.8, -3.96);
  console.log(bestDistance);
}
