import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToNearestTarget,
  pourToEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  checkBase,
  straighten,
  getTotalSun,
} from "../main";
import { Salt, Effects } from "../main";

/**
 * 1149=501+181+467
 * Not optimal. add 2nd and 3nd skirt later to save sun in 2nd part, exploiting maximal last part inside bone.
 */
function beta_1149s() {
  checkBase("water");
  logSkirt();
  logAddSunSalt(350);
  logAddStirCauldron(5);
  logAddSunSalt(120);
  logAddStirCauldron(6);
  logAddHeatVortex(Infinity);
  stirToTurn({ preStirLength: 5.3 });
  logAddSunSalt(501 - getTotalSun());
  const a1 = 37;
  derotateToAngle(-a1, { toAngle: true });
  logSkirt();
  logSkirt();
  derotateToAngle(-33.3, { toAngle: true });
  logAddHeatVortex(Infinity);
  stirIntoVortex(12.5);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddSunSalt(49);
  straighten(degToRad(120), Salt.Sun, { preStirLength: 9, maxGrains: 72 });
  stirToDangerZoneExit(3.3);
  pourToEdge();
  heatAndPourToEdge(0.2, 7);
  logAddHeatVortex(0);
  logAddStirCauldron(3.15);
  logAddSunSalt(42);
  stirToDangerZoneExit(2);
  logAddSunSalt(18);
  stirIntoVortex(1);
  logAddStirCauldron(0.345);
  logAddHeatVortex(4);
  logAddPourSolvent(1);
  derotateToAngle(0);
  logAddHeatVortex(1);
  stirToTurn({ preStirLength: 2.7 });
  logAddHeatVortex(Infinity);
  logAddStirCauldron(10);
  logAddHeatVortex(Infinity);
  logAddStirCauldron(10.9);
  logAddSunSalt(74);
  stirToDangerZoneExit();
  logAddSunSalt(155);
  stirToDangerZoneExit();
  logAddSunSalt(36);
  stirToTurn({ preStirLength: 4.5 });
  logAddSunSalt(201);
  logAddHeatVortex(5);
  logAddStirCauldron(5.396);
  logAddSunSalt(1);
  stirToNearestTarget(Effects.Water.Rejuvenation, { preStirLength: 5.2, maxStirLength: 0.5 });
}
