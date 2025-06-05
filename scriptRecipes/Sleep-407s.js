import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  checkBase,
  straighten,
} from "../main";

function main() {
  checkBase("water");
  logAddSunSalt(87);
  logSkirt();
  logAddSunSalt(21);
  logAddStirCauldron(3);
  straighten(1.82, "sun", { maxGrains: 253 - 21 });
  logAddStirCauldron(12.245);
  logAddHeatVortex(2);
  derotateToAngle(0);
  heatAndPourToEdge(0.3, 20);
  logAddHeatVortex(5.9);
  straighten(degToRad(129), "sun", { maxGrains: 67 });
  stirIntoVortex();
  logAddHeatVortex(5.12);
  derotateToAngle(0);
  logAddPourSolvent(4.129);
}
