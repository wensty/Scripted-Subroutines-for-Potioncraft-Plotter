// Subroutines defined in main script.
import { derotateToAngle, continuousPourToEdge, stirIntoVortex, straighten } from "../main.js";
// wrapped instructions defined in main script to implement statistics.
import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddHeatVortex,
  logAddPourSolvent,
} from "../main.js";
// utility functions defined in main script.
import { checkBase, degToRad, radToDeg, getAngleByDirection } from "../main.js";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

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
  stirToTurn(40 * SaltAngle);
  straighten(Infinity, degToRad(-7), "sun", 288 - 17);
  stirIntoVortex();

  let x = currentPlot.pendingPoints[0].x;
  let y = currentPlot.pendingPoints[0].y;
  console.log(radToDeg(getAngleByDirection(x + 9.08, y - 23.51)));

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
  continuousPourToEdge(0.4, 1, 10);
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
