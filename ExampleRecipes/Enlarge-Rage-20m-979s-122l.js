import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToNearestTarget,
  stirToTier,
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  getBottlePolarAngleByEntity,
  checkBase,
  straighten,
} from "../mainScript";
import { Effects } from "../mainScript";

function main() {
  checkBase("water");
  logSkirt();
  logSkirt();
  logAddStirCauldron(5.25);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(20);
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(4.3);
  logAddPourSolvent(1.1);
  logAddHeatVortex(Infinity);

  logAddSunSalt(17);
  stirToTurn();
  straighten(degToRad(-7), "sun", { maxGrains: 288 - 17 });
  stirIntoVortex();

  console.log(radToDeg(getBottlePolarAngleByEntity()) - 180);

  derotateToAngle(saltToDeg("sun", 200 - 0.99 - 48));
  logAddHeatVortex(Infinity);
  logAddStirCauldron(5);
  straighten(degToRad(-110), "sun", { maxGrains: 47 });
  logAddStirCauldron(1.6);
  logAddSunSalt(1);
  logAddStirCauldron(1.181);
  logAddStirCauldron(0.001);
  logAddSunSalt(260);
  stirIntoVortex();
  logAddSunSalt(41);
  logAddHeatVortex(3);
  pourToVortexEdge();
  heatAndPourToEdge(0.4, 10);
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

function beta_20m_978s_125hT() {
  checkBase("water");
  logSkirt();
  logSkirt();
  logAddStirCauldron(5.25);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(20);
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(4.3);
  logAddPourSolvent(1.1);
  logAddHeatVortex(Infinity);
  logAddSunSalt(17);
  stirToTurn();
  straighten(degToRad(-7), "sun", { maxGrains: 288 - 17 });
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity()) - 180);
  derotateToAngle(saltToDeg("sun", 200 - 0.99 - 47));
  logAddHeatVortex(Infinity);
  logAddStirCauldron(5);
  straighten(degToRad(-110), "sun", { maxGrains: 46 });
  logAddStirCauldron(1.38);
  logAddSunSalt(1);
  logAddStirCauldron(1.39);
  stirToTier(Effects.Water.Rage);
  logAddStirCauldron(0.001);
  logAddSunSalt(260);
  stirIntoVortex();
  logAddSunSalt(41);
  logAddHeatVortex(3);
  pourToVortexEdge();
  heatAndPourToEdge(0.4, 10);
  logAddHeatVortex(3.68);
  derotateToAngle(-61.24);
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddSunSalt(140);
  logAddStirCauldron(2.369);
  logAddSunSalt(1);
  logAddStirCauldron(5.7);
  stirToNearestTarget(Effects.Water.Enlargement);
  logAddSunSalt(201);
}
