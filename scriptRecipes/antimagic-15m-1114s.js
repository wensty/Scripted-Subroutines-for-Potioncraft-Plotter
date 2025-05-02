// Subroutins defined in main script.
import { derotateToAngle, stirIntoVortex, straighten } from "../main.js";
// utility functions defined in main script.
import { degToRad } from "../main.js";
// wrapped instructions defined in main script to implement statistics.
import { logAddIngredient, logAddSunSalt, logAddStirCauldron, logAddHeatVortex } from "../main.js";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function main() {
  logAddSunSalt(29);
  logAddSunSalt(137);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 29));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(3, degToRad(17.4), "sun", 9999, true);
  logAddStirCauldron(6);
  let direction = getAngleByDirection(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y
  );
  logAddSunSalt(36);
  logAddStirCauldron(3.3);
  straighten(Infinity, direction + degToRad(+0.2), "sun", 402, false);
  straighten(Infinity, direction + degToRad(+0.2), "moon", 15, true);
  stirIntoVortex();
  continuousPourToEdge(0.1, 1, 33);
  logAddHeatVortex(2.273);
  derotateToAngle(saltToDeg("moon", 201 + 33));
  straighten(4, degToRad(11), "sun", 200, true);
  logAddStirCauldron(1.095);
  logAddSunSalt(1);
  logAddStirCauldron(Infinity);
  logAddSunSalt(29);
}
