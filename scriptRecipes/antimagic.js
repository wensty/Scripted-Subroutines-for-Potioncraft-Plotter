import { derotateToAngle, stirIntoVortex, straighten } from "../main.js";
import { degToRad } from "../main.js";

import {
  addIngredient,
  addSunSalt,
  addMoonSalt,
  addHeatVortex,
  addStirCauldron,
} from "@potionous/instructions";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function main() {
  addSunSalt(38);
  addSunSalt(138);
  addIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 38));
  stirIntoVortex();
  addHeatVortex(Infinity);
  straighten(5, degToRad(17.1), "sun", 9999, true);
  addStirCauldron(4);
  /** The centor of the vortex near antimagic effect. */
  let direction = getAngleByDirection(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y,
  );
  addSunSalt(37);
  addStirCauldron(3.3);
  straighten(Infinity, direction, "sun", 375, false);
  addStirCauldron(0.05);
  addSunSalt(24);
  stirIntoVortex();
  continuousPourToEdge(0.07, 1, 40);
  addMoonSalt(23);
  addHeatVortex(2.91);
  addStirCauldron(1.73);
  /** The centor of the antimagic effect*/
  direction = getAngleByDirection(
    32.77 - currentPlot.pendingPoints[0].x,
    29.94 - currentPlot.pendingPoints[0].y,
  );
  straighten(0.85, direction, "sun", 204, true);
  addStirCauldron(0.92);
  addSunSalt(1);
  addStirCauldron(3.751);
}
