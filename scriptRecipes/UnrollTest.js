// Wrapped ingredient and salt instructions.
import { logAddIngredient } from "../main";
// Wrapped operation instructions.
import { logAddStirCauldron } from "../main";
// Angle conversions.
import { degToRad, radToDeg } from "../main";
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
  logAddStirCauldron(0.4);
  console.log("Current stir angle: " + radToDeg(getCurrentStirDirection()));
  straighten(50, degToRad(-90), "moon");
}
