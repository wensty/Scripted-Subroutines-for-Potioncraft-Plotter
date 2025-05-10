// Wrapped ingredient and salt instructions.
import { logAddIngredient, logAddSunSalt } from "../main";
// Wrapped operation instructions.
import { logAddHeatVortex, logAddStirCauldron } from "../main";
import { logAddPourSolvent } from "../main";
// Stirring subroutinees.
import { stirIntoVortex, stirToTurn, stirIntoSafeZone } from "../main";
// Pouring subroutines.
import { heatAndPourToEdge, derotateToAngle } from "../main";
// Angle conversions.
import { radToDeg } from "../main";
// Angle extractions.
import { getCurrentStirDirection } from "../main";
import { getBottlePolarAngleByVortex } from "../main";
// Complex subroutines.
import { straighten } from "../main";

import { Ingredients } from "@potionous/dataset";

function main() {
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddStirCauldron(5.525);
  logAddPourSolvent(Infinity);
  console.log(radToDeg(getCurrentStirDirection()));
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByVortex()) - 90);
  logAddHeatVortex(3);
  logAddStirCauldron(4);
  stirToTurn();
  stirToTurn();
  logAddPourSolvent(4);
  heatAndPourToEdge(0.5, 8);
  logAddHeatVortex(0.087);
  for (let i = 0; i < 3; i++) {
    stirToTurn();
  }
  straighten(0.8, getCurrentStirDirection(), "sun");
  stirIntoSafeZone();
  logAddSunSalt(117 - 60);
  stirIntoVortex();
  logAddStirCauldron(0.327);
  derotateToAngle(0);
  logAddHeatVortex(3.143);
  logAddStirCauldron(0.832);
  logAddHeatVortex(4.58);
}
