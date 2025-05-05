// Wrapped ingredient and salt instructions.
import { logAddIngredient, logAddMoonSalt, logAddSunSalt } from "../main";
// Wrapped operation instructions.
import { logAddHeatVortex, logAddStirCauldron } from "../main";
import { logAddPourSolvent } from "../main";
// Stirring subroutinees.
import { stirIntoVortex, stirToTurn } from "../main";
// Pouring subroutines.
import { pourToEdge, heatAndPourToEdge, derotateToAngle } from "../main";
// Angle conversions.
import { degToRad, radToDeg, saltToDeg } from "../main";
// Angle extractions.
import { getBottlePolarAngleByVortex } from "../main";
// Utilities.
import { checkBase } from "../main";
// Complex subroutines.
import { straighten } from "../main";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddStirCauldron(5.25);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(20);
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(4.3);
  logAddPourSolvent(1.1);
  logAddHeatVortex(Infinity);

  logAddSunSalt(17);
  stirToTurn();
  straighten(Infinity, degToRad(-7), "sun", 288 - 17);
  stirIntoVortex();

  console.log(radToDeg(getBottlePolarAngleByVortex()) - 180);

  derotateToAngle(saltToDeg("sun", 200 - 0.99 - 48));
  logAddHeatVortex(Infinity);
  logAddStirCauldron(5);
  straighten(Infinity, degToRad(-110), "sun", 47);
  logAddStirCauldron(1.6);
  logAddSunSalt(1);
  logAddStirCauldron(1.181);
  logAddStirCauldron(0.001);
  logAddSunSalt(260);
  stirIntoVortex();
  logAddSunSalt(41);
  logAddHeatVortex(3);
  pourToEdge();
  heatAndPourToEdge(0.4, 10);
  logAddHeatVortex(3.62);
  derotateToAngle(-61.2);
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddSunSalt(140);
  logAddStirCauldron(7.536);
  logAddSunSalt(1);
  logAddStirCauldron(0.682);
  logAddSunSalt(201);
}
