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
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
  setStirRounding,
} from "../main";
import { EntityVortex } from "../main";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("water");
  setStirRounding(true);
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
  logAddHeatVortex(0.788); // Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 7);
  logAddHeatVortex(3.98); //Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 17); // heavier continuous pour&stir save 1 more moon.
  logAddHeatVortex(0.15);
  logAddMoonSalt(61);
  stirToTurn(3.13); // roughly
  pourIntoVortex(13, 26);
  derotateToAngle(0.0);
  logAddHeatVortex(5.7);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(1.75); // Empirical
  stirToTier(10.46, 35.57, 0.0, 7.1); // roughly
  logAddPourSolvent(5.35); // Empirical
  let returnSalt = 280; // Empirical. Add less is not necessarily better.
  logAddSunSalt(returnSalt);
  stirToDangerZoneExit();
  logAddPourSolvent(1.63); // Empirical
  stirToDangerZoneExit();
  logAddPourSolvent(1.36); // Empirical
  stirIntoVortex();
  logAddHeatVortex(9.1); // Empirical
  pourIntoVortex(8, 16);
  logAddHeatVortex(Infinity);
  console.log(Math.ceil((180 + currentPlot.pendingPoints[0].angle) / 0.36) + 280);
  // predict 2nd part of sun salt
  straighten(Infinity, degToRad(48), "sun", 104);
  // pass the skeleton
  const saltToReverse = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  // match the angle entering vortex.
  straighten(Infinity, degToRad(-65.9), "sun", saltToReverse);
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity(EntityVortex, false)));
  logAddHeatVortex(4.6);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(5.12);
  derotateToAngle(saltToDeg("moon", 100 + 33.3));
  logAddStirCauldron(9.5);
  straighten(Infinity, degToRad(5), "sun", 99);
  // last salt for precise centering
  logAddStirCauldron(0.933);
  logAddSunSalt(1);
  console.log("path deviation: " + stirToNearestTarget(-4.22, 36.37, 4.1));
}
