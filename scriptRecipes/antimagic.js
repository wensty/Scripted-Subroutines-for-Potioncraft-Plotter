import { derotateToAngle, stirIntoVortex, straighten } from "../main.js";
import { logAddIngredient, logAddSunSalt, logAddStirCauldron, logAddHeatVortex } from "../main.js";
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
  logAddSunSalt(29);
  logAddSunSalt(138);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 29));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(3, degToRad(17.6), "sun", 9999, true);
  logAddStirCauldron(6);
  let direction = getAngleByDirection(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y
  );
  logAddSunSalt(37);
  logAddStirCauldron(3.3);
  straighten(Infinity, direction + degToRad(0.0), "sun", 400, false);
  straighten(Infinity, direction + degToRad(0.0), "moon", 20, true);
  stirIntoVortex();
  continuousPourToEdge(0.2, 1, 12);
  logAddHeatVortex(2.7);
  straighten(4, degToRad(11.6), "sun", 208, true);
  logAddStirCauldron(0.78);
  logAddSunSalt(1);
  logAddStirCauldron(3.758);
}
