import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  pourToZone,
  degToRad,
  vecToDirCoord,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getTotalSun,
} from "../mainScript";
import { SaltType, Entity } from "../mainScript";

import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("oil");
  logSkirt();
  logAddStirCauldron(4.55);
  const a1 = getAngleOrigin();
  console.log(a1);
  console.log(getStirDirection());
  logAddPourSolvent(1.85);
  straighten(a1 - Math.PI / 2, SaltType.Sun, { maxGrains: 129 });
  const d1 =
    vecToDirCoord(3.88 - currentPlot.pendingPoints[0].x, 4.15 - currentPlot.pendingPoints[0].y) +
    Math.PI / 2;
  console.log(d1);
  stirIntoVortex();
  console.log(getAngleEntity() + Math.PI * 1.5);
  // Part 2
  logAddHeatVortex(Infinity);
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  logAddSunSalt(264);
  stirToTurn({ preStirLength: 8.3 });
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  straighten(vecToDirCoord(x2 - x1, y2 - y1), SaltType.Sun, { maxGrains: 501 - getTotalSun() });
  stirToTurn();
  const a2 = getAngleOrigin();
  console.log("a2: " + a2);
  logAddPourSolvent(1.08);
  console.log(getStirDirection());
  stirToTurn();
  logAddPourSolvent(2.73);
  console.log(getStirDirection());
  stirToTurn();
  pourToZone(2, Entity.Swamp);
  for (let i = 0; i < 19; i++) {
    logAddStirCauldron(0.1);
    pourToZone(0.15, Entity.Swamp);
  }
  // Part 3
  const x3 = currentPlot.pendingPoints[0].x;
  const y3 = currentPlot.pendingPoints[0].y;
  logAddSunSalt(39);
  logAddStirCauldron(8.4);
  const x4 = currentPlot.pendingPoints[0].x;
  const y4 = currentPlot.pendingPoints[0].y;
  straighten(vecToDirCoord(x4 - x3, y4 - y3) + degToRad(0), SaltType.Sun, {
    maxGrains: 835 - getTotalSun(),
  });
  logAddStirCauldron(Infinity);
}
