import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  stirIntoVortex,
  stirToTurn,
  stirToNearestTarget,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  saltToDeg,
  vecToDirCoord,
  getBottlePolarAngleByEntity,
  checkBase,
  straighten,
  setDisplay,
} from "../mainScript";
import { Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

function main() {
  checkBase("oil");
  logAddSunSalt(28);
  logAddSunSalt(138);
  logSkirt();
  derotateToAngle(saltToDeg("sun", 28));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(degToRad(17.4), "sun", { maxStir: 3 }); // Distance specified straightening.
  logAddStirCauldron(6);
  let direction = vecToDirCoord(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y
  );
  logAddSunSalt(37);
  logAddStirCauldron(3.3);
  // Salt specified straightening. Defalt option is not ignoring the reverse direction.
  straighten(direction + degToRad(+0.0), "sun", { maxGrains: 400, ignoreReverse: false });
  straighten(direction + degToRad(+0.0), "moon", { maxGrains: 15 });
  stirIntoVortex();
  heatAndPourToEdge(0.1, 33);
  logAddHeatVortex(2.28);
  derotateToAngle(saltToDeg("moon", 202 + 33));
  straighten(degToRad(11), "sun", { maxStir: 4, maxGrains: 201 });
  logAddStirCauldron(3.11);
  logAddSunSalt(1);
  console.log("path deviation: " + stirToNearestTarget(Effects.Oil.AntiMagic, { preStir: 1.2 }));
}

function beta() {
  checkBase("oil");
  setDisplay(false);
  logAddSunSalt(26);
  logAddSunSalt(141);
  logSkirt();
  derotateToAngle(saltToDeg("sun", 26));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(degToRad(17.23), "sun", { maxStir: 3 }); // Distance specified straightening.
  logAddStirCauldron(6.2);
  logAddSunSalt(57);
  const x = currentPlot.pendingPoints[0].x;
  const y = currentPlot.pendingPoints[0].y;
  // logAddStirCauldron(3.3);
  let direction = vecToDirCoord(29.63 - x, 21.91 - y) + degToRad(4.8);
  stirToTurn();
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  console.log(direction);
  console.log(vecToDirCoord(x2 - x, y2 - y));

  // Salt specified straightening. Defalt option is not ignoring the reverse direction.
  straighten(direction, "sun", { maxGrains: 369, ignoreReverse: false });
  straighten(direction, "moon", { maxGrains: 13 });
  stirIntoVortex();
  const x3 = currentPlot.pendingPoints[0].x;
  const y3 = currentPlot.pendingPoints[0].y;
  console.log(getBottlePolarAngleByEntity() + Math.PI);

  heatAndPourToEdge(0.1, 30);
  logAddHeatVortex(2.53);
  derotateToAngle(saltToDeg("moon", 208 + 33));
  straighten(degToRad(11), "sun", { maxStir: 4, maxGrains: 207 });
  logAddStirCauldron(1.21);
  logAddSunSalt(1);
  console.log("path deviation: " + stirToNearestTarget(Effects.Oil.AntiMagic, { preStir: 1.2 }));
}
