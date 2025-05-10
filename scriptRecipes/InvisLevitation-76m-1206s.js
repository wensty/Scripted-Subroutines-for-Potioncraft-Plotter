import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirIntoSafeZone,
  stirToTier,
  stirToNearestTarget,
  pourToEdge,
  heatAndPourToEdge,
  derotateToAngle,
  pourIntoVortex,
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
  const delay = 290;
  logAddSunSalt(243);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddSunSalt(14);
  logAddStirCauldron(4.55);
  console.log(getBottlePolarAngle());
  console.log(getCurrentStirDirection());
  let direction = getBottlePolarAngle();
  straighten(Infinity, direction, "sun", delay - 243 - 14);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  straighten(Infinity, direction, "sun", 501 - delay);
  logAddStirCauldron(11);
  stirToTurn();
  logAddHeatVortex(2.5);
  heatAndPourToEdge(1, 10, VortexRadiusLarge);
  derotateToAngle(-113);
  logAddHeatVortex(0.87); // Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 6, VortexRadiusLarge);
  logAddHeatVortex(4); //Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 17, VortexRadiusLarge);
  logAddHeatVortex(0.2);
  logAddPourSolvent(1.65);
  logAddMoonSalt(76);
  logAddStirCauldron(3.06);
  stirToTurn();
  derotateToAngle(0.0);
  logAddHeatVortex(5);
  pourToEdge();
  heatAndPourToEdge(1, 9, VortexRadiusLarge);
  logAddHeatVortex(1.71); // Empirical
  logAddStirCauldron(7.1);
  stirToTier(10.46, 35.57, 0.0);
  logAddPourSolvent(5.28);
  logAddSunSalt(290);
  stirIntoSafeZone();
  logAddPourSolvent(1.55);
  stirIntoSafeZone();
  logAddPourSolvent(1.4);
  stirIntoVortex();
  logAddHeatVortex(9.28);
  logAddPourSolvent(7.5);
  pourIntoVortex(0.5);
  logAddHeatVortex(Infinity);
  console.log(getCurrentStirDirection());
  straighten(Infinity, degToRad(57), "sun", 83);
  logAddStirCauldron(1.7);
  logAddSunSalt(1);
  const saltToReverse = Math.ceil((180 + currentPlot.pendingPoints[0].angle) / 0.36);
  straighten(Infinity, degToRad(-64.36), "sun", saltToReverse);
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByVortex(false)));
  logAddHeatVortex(4);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(4.751);
  derotateToAngle(saltToDeg("moon", 105 + 33));
  straighten(Infinity, degToRad(-25), "sun", 104);
  logAddStirCauldron(1.86);
  logAddSunSalt(1);
  logAddStirCauldron(3.02);
  stirToNearestTarget(-4.22, 36.37);
}
