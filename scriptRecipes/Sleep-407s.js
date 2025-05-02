// Subroutines defined in main script.
import { derotateToAngle, continuousPourToEdge, stirIntoVortex, straighten } from "../main.js";
// utility functions defined in main script.
import { degToRad } from "../main.js";
// wrapped instructions defined in main script to implement statistics.
import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logaddRotationSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  logaddSetPosition,
} from "../main.js";

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
  continuousPourToEdge(0.3, 1, 20);
  logAddHeatVortex(5.9);
  straighten(Infinity, degToRad(129), "sun", 67, true);
  stirIntoVortex();
  logAddHeatVortex(5.12);
  derotateToAngle(0);
  logAddPourSolvent(4.129);
}
