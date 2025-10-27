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
  pourToVortexEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  derotateToAngle,
  degToRad,
  radToDeg,
  getAngleEntity,
  checkBase,
  straighten,
  getTotalSun,
  setStirRounding,
} from "../mainScript";
import { DeviationT1, Salt, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  setStirRounding(true);
  logSkirt();
  logAddStirCauldron(5);
  logAddSunSalt(263);
  stirIntoVortex();
  stirToTurn();
  logAddSunSalt(501 - getTotalSun());
  heatAndPourToEdge(3, 5); // 3 empirical instruction.
  logAddHeatVortex(3.76);
  derotateToAngle(-154.5);
  // MagicVision
  stirToTier(Effects.Water.MagicalVision, {
    preStir: 3.6,
    deviation: DeviationT1,
    ignoreAngle: true,
  });
  pourIntoVortex(16, 6);
  logAddHeatVortex(8);
  pourToVortexEdge();
  heatAndPourToEdge(3, 4);
  logAddHeatVortex(5.9);
  derotateToAngle(-79);
  // Dexterity
  stirToTier(Effects.Water.Dexterity, {
    preStir: 2.0,
    deviation: DeviationT1,
    ignoreAngle: true,
  });
  logAddPourSolvent(6.05); // 2 empirical value
  stirToDangerZoneExit();
  logAddPourSolvent(5.96);
  stirToDangerZoneExit();
  logAddPourSolvent(Infinity);
  const delay = 103;
  const direction = 178;
  straighten(degToRad(direction), Salt.Sun, { maxGrains: delay });
  logAddIngredient(Ingredients.GraveTruffle);
  straighten(degToRad(direction), Salt.Sun, { maxGrains: 130 - delay }); // 501+130 sun
  // Strength
  stirIntoVortex();
  console.log(radToDeg(getAngleEntity()) + 180);
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
