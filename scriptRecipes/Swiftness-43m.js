// Wrapped ingredient and salt instructions.
import { logAddIngredient } from "../main";
// Wrapped operation instructions.
import { logAddStirCauldron } from "../main";
import { logAddPourSolvent } from "../main";
// Angle conversions.
import { radToDeg } from "../main";
// Angle extractions.
import { getCurrentStirDirection } from "../main";
// Utilities.
import { checkBase } from "../main";
// Complex subroutines.
import { straighten } from "../main";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(14.4);
  logAddPourSolvent(100);
  console.log("Current stir angle: " + radToDeg(getCurrentStirDirection()));
  logAddStirCauldron(3.8);
  let currentStirAngle = getCurrentStirDirection();
  console.log("Current stir angle: " + radToDeg(currentStirAngle));
  straighten(10, currentStirAngle, "moon", 43);
}
