// Wrapped ingredient and salt instructions.
import { logAddIngredient, logAddSunSalt } from "../main";
// Wrapped operation instructions.
import { logAddHeatVortex, logAddStirCauldron } from "../main";
import { logAddPourSolvent } from "../main";
// Stirring subroutinees.
import { stirIntoVortex } from "../main";
// Pouring subroutines.
import { heatAndPourToEdge, derotateToAngle } from "../main";
// Angle conversions.
import { degToRad } from "../main";
// Utilities.
import { checkBase } from "../main";
// Complex subroutines.
import { straighten } from "../main";

import { checkBase, degToRad } from "../main.js";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  logAddSunSalt(87);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddSunSalt(21);
  logAddStirCauldron(3);
  straighten(Infinity, 1.82, "sun", 253 - 21, true);
  logAddStirCauldron(12.245);
  logAddHeatVortex(2);
  derotateToAngle(0);
  heatAndPourToEdge(0.3, 20);
  logAddHeatVortex(5.9);
  straighten(Infinity, degToRad(129), "sun", 67, true);
  stirIntoVortex();
  logAddHeatVortex(5.12);
  derotateToAngle(0);
  logAddPourSolvent(4.129);
}
