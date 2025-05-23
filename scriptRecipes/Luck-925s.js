import {
  logAddIngredient,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToNearestTarget,
  degToRad,
  getBottlePolarAngle,
  checkBase,
  straighten,
} from "../main";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("wine");
  let totalSun = 0;
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  totalSun += straighten(Infinity, degToRad(87), "sun", 337);
  logAddStirCauldron(9);
  stirToTurn();
  totalSun += straighten(Infinity, getBottlePolarAngle(), "sun", 501 - totalSun);
  logAddPourSolvent(1.67);
  const s = Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36);
  console.log("Final Salt: " + (s + 501));
  logAddStirCauldron(11);
  totalSun += straighten(1.3, degToRad(42.1), "sun", s);
  logAddStirCauldron(0.207); // centering.
  totalSun += logAddSunSalt(1);
  console.log(stirToNearestTarget(26.56, 10.66));
  logAddSunSalt(s + 501 - totalSun);
}
