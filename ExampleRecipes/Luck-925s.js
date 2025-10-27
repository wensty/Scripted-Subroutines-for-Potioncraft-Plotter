import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToTarget,
  degToRad,
  getAngleOrigin,
  checkBase,
  straighten,
} from "../mainScript";
import { Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("wine");
  let totalSun = 0;
  logSkirt();
  totalSun += straighten(degToRad(87), "sun", { maxGrains: 337 });
  logAddStirCauldron(9);
  stirToTurn();
  totalSun += straighten(getAngleOrigin(), "sun", { maxGrains: 501 - totalSun });
  logAddPourSolvent(1.67);
  const s = Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36);
  console.log("Final Salt: " + (s + 501));
  logAddStirCauldron(11);
  totalSun += straighten(degToRad(42.1), "sun", { maxStir: 1.3, maxGrains: s });
  logAddStirCauldron(0.207); // centering.
  totalSun += logAddSunSalt(1);
  console.log(stirToTarget(Effects.Wine.Luck));
  logAddSunSalt(s + 501 - totalSun);
}
