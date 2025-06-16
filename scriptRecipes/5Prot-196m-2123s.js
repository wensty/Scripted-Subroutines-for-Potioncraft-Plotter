/**
 * Full import script.
 */
import {
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
  stirToConsume,
  pourToEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  getDirectionByVector,
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
  getTotalSun,
  setDisplay,
  setStirRounding,
} from "../main";
import { SaltAngle, DeviationT1, EntityPotionEffect, Effects } from "../main";

import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("oil");
  setDisplay(false);
  setStirRounding(true);
  logAddSunSalt(110);
  logSkirt();
  logAddPourSolvent(Infinity);
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(degToRad(15.2), "sun", { maxStirLength: 2.8 });
  // winding the swamp
  logAddStirCauldron(6.1);
  logAddSunSalt(39);
  logAddStirCauldron(1.55);
  logAddSunSalt(81);
  stirToTurn();
  straighten(degToRad(90), "sun", { maxStirLength: 0.8 });
  logAddSunSalt(73);
  straighten(getCurrentStirDirection(), "sun", {
    maxStirLength: 1,
    maxGrains: 780 - getTotalSun(),
  });
  // 780 sun into vortex.
  stirIntoVortex();
  stirToConsume(0.26);
  heatAndPourToEdge(3, 9);
  const a1 = -21;
  derotateToAngle(a1);
  logAddHeatVortex(3.04);
  // Antimagic
  logAddStirCauldron(Infinity);
  // return to vortex.
  logAddPourSolvent(7.27);
  logSkirt();
  console.log(getBottlePolarAngle());
  stirIntoVortex();
  console.log(getBottlePolarAngleByEntity() + Math.PI / 2);
  logAddHeatVortex(0.4);
  pourToEdge();
  heatAndPourToEdge(3, 5);
  derotateToAngle(0);
  logAddHeatVortex(6.95);
  console.log(getBottlePolarAngle());
  // part 2
  logAddPourSolvent(12);
  const x = currentPlot.pendingPoints[0].x;
  const y = currentPlot.pendingPoints[0].y;
  console.log(getBottlePolarAngle() + Math.PI / 2);
  console.log(getDirectionByVector(28.91 - x, 1.7 - y));
  logAddSunSalt(80);
  logSkirt();
  logAddSunSalt(10);
  stirToTurn(4.0, 0.1, 0.01 * SaltAngle);
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  console.log(getCurrentStirDirection());
  console.log(getDirectionByVector(x2 - x, y2 - y));
  straighten(getDirectionByVector(28.91 - x2, 1.7 - y2), "sun", { maxGrains: 345 });
  // Fire protection.
  stirToTier(Effects.Oil.FireProtection, {
    preStirLength: 7.6,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
  console.log(getBottlePolarAngleByEntity(EntityPotionEffect) + Math.PI);
  logAddSunSalt(Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36));
  logAddPourSolvent(7.8);
  logAddStirCauldron(4);
  stirToTurn();
  straighten(getCurrentStirDirection(), "sun", { maxStirLength: 1.1, maxGrains: 64 });
  stirToDangerZoneExit();
  logAddPourSolvent(0.9);
  stirToDangerZoneExit();
  logAddPourSolvent(0.75);
  stirToDangerZoneExit();
  logAddPourSolvent(1);
  stirToDangerZoneExit();
  logAddPourSolvent(0.99);
  stirToDangerZoneExit();
  logAddPourSolvent(0.88);
  console.log(getBottlePolarAngle());
  stirIntoVortex();
  console.log(getBottlePolarAngleByEntity() + Math.PI / 2);
  logAddHeatVortex(2);
  logAddPourSolvent(0.5);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  straighten(degToRad(-178), "sun", { maxStirLength: 3.8, maxGrains: 210 });
  stirToTurn();
  logAddSunSalt(139);
  stirIntoVortex();
  logAddHeatVortex(5.62);
  logAddSunSalt(150);
  // Acid protection.
  stirToTier(Effects.Oil.AcidProtection, {
    preStirLength: 11.1,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
  // part 3
  logAddPourSolvent(10.7);
  console.log(getBottlePolarAngle());
  logAddMoonSalt(89);
  logSkirt();
  logAddMoonSalt(46);
  stirIntoVortex();
  console.log(getBottlePolarAngleByEntity() + Math.PI / 2);
  logAddHeatVortex(0.8);
  pourToEdge();
  heatAndPourToEdge(3, 4);
  logAddHeatVortex(6.7);
  derotateToAngle(56.3);
  // Lightning Protection
  stirToTier(Effects.Oil.LightningProtection, {
    preStirLength: 7.7,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
  // return to origin.
  logAddPourSolvent(9.7);
  logAddStirCauldron(1.65);
  logAddPourSolvent(Infinity);
  // part 4
  logAddStirCauldron(0.25);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(35);
  stirIntoVortex();
  heatAndPourToEdge(3, 3);
  logAddHeatVortex(2.25);
  logAddMoonSalt(26);
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(2.42);
  stirToDangerZoneExit();
  logAddPourSolvent(1.93);
  console.log(getBottlePolarAngle());
  stirIntoVortex();
  console.log(getBottlePolarAngleByEntity() - Math.PI / 2);
  logAddHeatVortex(5);
  heatAndPourToEdge(3, 7);
  logAddHeatVortex(1.04);
  stirToDangerZoneExit();
  logAddPourSolvent(0.9);
  logAddStirCauldron(1);
  const x3 = currentPlot.pendingPoints[0].x;
  const y3 = currentPlot.pendingPoints[0].y;
  straighten(getDirectionByVector(-20.8 - x3, 5.34 - y3), "sun", { maxStirLength: 1.6 });
  stirIntoVortex();
  logAddHeatVortex(4);
  pourToEdge();
  heatAndPourToEdge(0.3, 8);
  logAddHeatVortex(2.84);
  logAddSunSalt(112);
  // Frost protection.
  stirToTier(Effects.Oil.FrostProtection, {
    preStirLength: 8.7,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
}
