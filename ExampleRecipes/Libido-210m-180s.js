import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToNearestTarget,
  vecToDirCoord,
  straighten,
  getTotalSun,
} from "../mainScript";
import { Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

function main() {
  logSkirt();
  logAddStirCauldron(5.8);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(45);
  logAddStirCauldron(9.8);
  logAddPourSolvent(1.66);
  logAddStirCauldron(1.84);
  let x = currentPlot.pendingPoints[0].x || 0.0;
  let y = currentPlot.pendingPoints[0].y || 0.0;
  straighten(vecToDirCoord(-17.67 - x, 3.61 - y), "sun", { maxStir: 0.56 });
  logAddSunSalt(179 - getTotalSun());
  logAddStirCauldron(2.503);
  logAddSunSalt(1);
  logAddStirCauldron(8.15);
  stirToNearestTarget(Effects.Wine.Libido);
  logAddMoonSalt(165);
}
