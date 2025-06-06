import {
  logAddIngredient,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTier,
  pourToEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  derotateToAngle,
  degToRad,
  radToDeg,
  getBottlePolarAngleByEntity,
  checkBase,
  straighten,
  getTotalSun,
  setStirRounding,
} from "../main";
import { DeviationT1, Salt } from "../main";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  setStirRounding(true);
  logSkirt();
  logAddStirCauldron(5);
  logAddSunSalt(263);
  // logAddStirCauldron(12)
  stirIntoVortex();
  stirToTurn();
  logAddSunSalt(501 - getTotalSun());
  heatAndPourToEdge(3, 5); // 3 empirical instruction.
  logAddHeatVortex(3.76);
  derotateToAngle(-154.5);
  // MagicVision
  stirToTier(21.27, 10.44, 0.0, 3.6, DeviationT1, true);
  pourIntoVortex(16, 6);
  logAddHeatVortex(8);
  pourToEdge();
  heatAndPourToEdge(3, 4);
  logAddHeatVortex(5.9);
  derotateToAngle(-79);
  // Dexterity
  stirToTier(20.86, 3.19, 0.0, 2.0, DeviationT1, true);
  logAddPourSolvent(6.05); // 2 empirical value
  stirToDangerZoneExit();
  logAddPourSolvent(5.96);
  stirToDangerZoneExit();
  logAddPourSolvent(Infinity);
  const delay = 103;
  const direction = 178;
  straighten(Infinity, degToRad(direction), Salt.Sun, delay);
  logAddIngredient(Ingredients.GraveTruffle);
  straighten(Infinity, degToRad(direction), Salt.Sun, 130 - delay); // 501+130 sun
  // Strength
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity()) + 180);
  derotateToAngle(25.903);
  logAddHeatVortex(Infinity);
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1.885);
  logAddSunSalt(61);
  stirToDangerZoneExit();
  logAddPourSolvent(0.485); // 5 empirical pouring.
  stirToDangerZoneExit();
  logAddPourSolvent(0.78);
  stirToDangerZoneExit();
  logAddPourSolvent(0.725);
  stirToDangerZoneExit();
  logAddPourSolvent(0.8);
  stirToDangerZoneExit();
  logAddPourSolvent(1.23);
  stirToDangerZoneExit();
  stirToTurn();
  logAddStirCauldron(0.009); // maximal to achieve T1 for swiftness.
  logAddPourSolvent(5);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(Infinity);
  stirToTurn();
  logAddMoonSalt(36);
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(4.2);
  logAddPourSolvent(1.2);
  logAddHeatVortex(Infinity);
}
