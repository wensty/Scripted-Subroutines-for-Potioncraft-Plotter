import {
  logAddIngredient,
  logAddStirCauldron,
  logAddPourSolvent,
  radToDeg,
  getStirDirection,
  checkBase,
  straighten,
} from "../mainScript";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(14.4);
  logAddPourSolvent(100);
  console.log("Current stir angle: " + radToDeg(getStirDirection()));
  logAddStirCauldron(3.8);
  let currentStirAngle = getStirDirection();
  console.log("Current stir angle: " + radToDeg(currentStirAngle));
  straighten(currentStirAngle, "moon", { maxStir: 10, maxGrains: 43 });
}
