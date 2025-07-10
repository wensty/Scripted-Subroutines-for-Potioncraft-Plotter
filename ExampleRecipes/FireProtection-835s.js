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
  getDirectionByVector,
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
  getTotalSun,
} from "../main";
import { Salt, Entity } from "../main";

import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("oil");
  logSkirt();
  logAddStirCauldron(4.55);
  const a1 = getBottlePolarAngle();
  console.log(a1);
  console.log(getCurrentStirDirection());
  logAddPourSolvent(1.85);
  straighten(a1 - Math.PI / 2, Salt.Sun, { maxGrains: 129 });
  const d1 =
    getDirectionByVector(
      3.88 - currentPlot.pendingPoints[0].x,
      4.15 - currentPlot.pendingPoints[0].y
    ) +
    Math.PI / 2;
  console.log(d1);
  stirIntoVortex();
  console.log(getBottlePolarAngleByEntity() + Math.PI * 1.5);
  // Part 2
  logAddHeatVortex(Infinity);
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  logAddSunSalt(264);
  stirToTurn({ preStirLength: 8.3 });
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  straighten(getDirectionByVector(x2 - x1, y2 - y1), Salt.Sun, { maxGrains: 501 - getTotalSun() });
  stirToTurn();
  const a2 = getBottlePolarAngle();
  console.log("a2: " + a2);
  logAddPourSolvent(1.08);
  console.log(getCurrentStirDirection());
  stirToTurn();
  logAddPourSolvent(2.73);
  console.log(getCurrentStirDirection());
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
  straighten(getDirectionByVector(x4 - x3, y4 - y3) + degToRad(0), Salt.Sun, {
    maxGrains: 835 - getTotalSun(),
  });
  logAddStirCauldron(Infinity);
}
