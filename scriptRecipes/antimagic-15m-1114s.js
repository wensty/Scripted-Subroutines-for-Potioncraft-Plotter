// Subroutines defined in main script.
import { derotateToAngle, continuousPourToEdge, stirIntoVortex, straighten } from "../main.js";
// utility functions defined in main script.
import { degToRad } from "../main.js";
// wrapped instructions defined in main script to implement statistics.
import { logAddIngredient, logAddSunSalt, logAddStirCauldron, logAddHeatVortex } from "../main.js";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function main() {
  checkBase("oil");
  logAddSunSalt(28);
  logAddSunSalt(138);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 28));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(3, degToRad(17.4), "sun"); // Distance specified straightening.
  logAddStirCauldron(6);
  let direction = getAngleByDirection(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y
  );
  logAddSunSalt(37);
  logAddStirCauldron(3.3);
  /**
   * Salt specified straightening.
   */
  straighten(Infinity, direction + degToRad(+0.0), "sun", 400, false);
  straighten(Infinity, direction + degToRad(+0.0), "moon", 15, true);
  stirIntoVortex();
  continuousPourToEdge(0.1, 1, 33);
  logAddHeatVortex(2.283);
  derotateToAngle(saltToDeg("moon", 202 + 33));
  straighten(4, degToRad(11), "sun", 201, true);
  logAddStirCauldron(0.497);
  logAddSunSalt(1);
  logAddStirCauldron(3.98);
}
