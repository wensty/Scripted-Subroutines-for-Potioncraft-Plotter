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
  vecToDirCoord,
  getBottlePolarAngleByEntity,
  checkBase,
  straighten,
  setDisplay,
} from "../mainScript";
import { Salt, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("water");
  setDisplay(false);
  logAddSunSalt(408);
  logSkirt();
  logAddSunSalt(360);
  const av = vecToDirCoord(-18.93, -16.34);
  console.log("av:" + av);
  logAddStirCauldron(4.8);
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  const av2 = vecToDirCoord(-18.93 - x1, -16.34 - y1);
  console.log("av2:" + av2);
  straighten(av2, Salt.Sun, { maxStir: 1, maxGrains: 349 });
  stirToTurn({ preStirLength: 8 });
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  const av3 = vecToDirCoord(-18.93 - x2, -16.34 - y2);
  console.log("av3:" + av3);
  straighten(av2, Salt.Sun, { maxGrains: 384, ignoreReverse: false });
  stirIntoVortex(3);
  const ae = getBottlePolarAngleByEntity() - Math.PI;
  console.log(ae);
  heatAndPourToEdge(1, 5);
  logAddHeatVortex(4.83);
  derotateToAngle(29.7, { toAngle: false });
  logAddStirCauldron(4.9);
  setDisplay(true);
  straighten(degToRad(-110), Salt.Sun, { maxGrains: 257 });
  logAddStirCauldron(2.81);
  logAddSunSalt(1);
  console.log("nearest:" + stirToNearestTarget(Effects.Water.Acid, { preStir: 2 }));
  logAddSunSalt(111);
}
