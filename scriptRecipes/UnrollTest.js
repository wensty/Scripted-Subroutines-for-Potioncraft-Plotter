// Subroutines defined in main script.
import { straighten } from "../main.js";
// wrapped instructions defined in main script to implement statistics.
import { logAddIngredient, logAddStirCauldron } from "../main.js";
// utility functions defined in main script.
import { checkBase, degToRad } from "../main.js";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(0.4);
  console.log("Current stir angle: " + radToDeg(getCurrentStirDirection()));
  straighten(50, degToRad(-90), "moon");
}
