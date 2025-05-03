// Subroutines defined in main script.
import { straighten } from "../main.js";
// utility functions defined in main script.
// wrapped instructions defined in main script to implement statistics.
import { logAddIngredient, logAddStirCauldron, logAddPourSolvent } from "../main.js";

import { Ingredients } from "@potionous/dataset";

function main() {
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(14.4);
  logAddPourSolvent(100);
  console.log("Current stir angle: " + radToDeg(getCurrentStirDirection()));
  logAddStirCauldron(3.8);
  let currentStirAngle = getCurrentStirDirection();
  console.log("Current stir angle: " + radToDeg(currentStirAngle));
  straighten(10, currentStirAngle, "moon", 43);
}
