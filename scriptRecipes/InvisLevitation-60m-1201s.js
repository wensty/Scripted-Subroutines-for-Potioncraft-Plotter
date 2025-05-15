import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToNearestTarget,
  stirToTier,
  pourToEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  derotateToAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  getBottlePolarAngle,
  getBottlePolarAngleByVortex,
  getCurrentStirDirection,
  checkBase,
  straighten,
} from "../main";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("water");
  const delay = 300; // need more test
  logAddSunSalt(243);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddSunSalt(14);
  logAddStirCauldron(4.55);
  console.log(getBottlePolarAngle());
  console.log(getCurrentStirDirection());
  const direction = getBottlePolarAngle();
  straighten(Infinity, direction, "sun", delay - 243 - 14);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  straighten(Infinity, direction, "sun", 501 - delay);
  logAddStirCauldron(11);
  stirToTurn();
  logAddHeatVortex(2.5);
  heatAndPourToEdge(1, 10);
  derotateToAngle(-113);
  logAddHeatVortex(0.886); // Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 7);
  logAddHeatVortex(3.95); //Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 17); // heavier continuous pour&stir save 1 more moon.
  logAddHeatVortex(0.15);
  logAddMoonSalt(61);
  logAddStirCauldron(3.13); // roughly.
  stirToTurn();
  pourIntoVortex(13, 26);
  derotateToAngle(0.0);
  logAddHeatVortex(5.7);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(1.81); // Empirical
  logAddStirCauldron(7.1); // roughly
  stirToTier(10.46, 35.57, 0.0);
  logAddPourSolvent(5.3); // Empirical
  let returnSalt = 280; // Empirical. Add less is not necessarily better.
  logAddSunSalt(returnSalt);
  stirToDangerZoneExit();
  logAddPourSolvent(1.63); // Empirical
  stirToDangerZoneExit();
  logAddPourSolvent(1.36); // Empirical
  stirIntoVortex();
  logAddHeatVortex(9.28); // Empirical
  pourIntoVortex(8, 16);
  logAddHeatVortex(Infinity);
  console.log(Math.ceil((180 + currentPlot.pendingPoints[0].angle) / 0.36) + 280);
  // predict 2nd part of sun salt
  straighten(Infinity, degToRad(50), "sun", 105);
  // pass the skeleton
  const saltToReverse = Math.ceil((180 + currentPlot.pendingPoints[0].angle) / 0.36);
  // match the angle entering vortex.
  straighten(Infinity, degToRad(-65.9), "sun", saltToReverse);
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByVortex(false)));
  logAddHeatVortex(4.6);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(5.4);
  derotateToAngle(saltToDeg("moon", 103 + 33));
  // -25 is not the proper straightening angle meeting optimal condition.
  // More test is needed.
  straighten(Infinity, degToRad(-25), "sun", 102);
  // last salt for precise centering
  logAddStirCauldron(1.83);
  logAddSunSalt(1);
  logAddStirCauldron(3);
  console.log("path deviation: " + stirToNearestTarget(-4.22, 36.37));
}
