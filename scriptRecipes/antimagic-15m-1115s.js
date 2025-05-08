// Subroutines defined in main script.
// wrapped instructions defined in main script to implement statistics.
// utility functions defined in main script.

// Wrapped ingredient and salt instructions.
import { logAddIngredient, logAddSunSalt } from "../main";
// Wrapped operation instructions.
import { logAddHeatVortex, logAddStirCauldron } from "../main";
// Stirring subroutinees.
import { stirIntoVortex } from "../main";
// Pouring subroutines.
import { heatAndPourToEdge, derotateToAngle } from "../main";
// Angle conversions.
import { degToRad, saltToDeg } from "../main";
// Angle extractions.
import { getDirectionByVector } from "../main";
// Utilities.
import { checkBase } from "../main";
// Complex subroutines.
import { straighten } from "../main";

import { stirToNearestTarget } from "../main";

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
  let direction = getDirectionByVector(
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
  heatAndPourToEdge(0.1, 33);
  logAddHeatVortex(2.281);
  console.log(saltToDeg("moon", 202 + 33));
  derotateToAngle(saltToDeg("moon", 202 + 33));
  straighten(4, degToRad(11), "sun", 201, true);
  logAddStirCauldron(2.25);
  logAddSunSalt(1);
  console.log("path deviation: " + stirToNearestTarget(32.77, 29.94));
}
