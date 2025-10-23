import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToNearestTarget,
  derotateToAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  vecToDirCoord,
  checkBase,
  straighten,
  getTotalSun,
  setDisplay,
} from "../mainScript";
import { Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("wine");
  setDisplay(false);
  logAddSunSalt(70);
  logSkirt();
  derotateToAngle(saltToDeg("sun", 53 - 0.9));
  const direction = degToRad(28.4);
  straighten(direction, "sun", { maxGrains: 167 });
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  logAddStirCauldron(7);
  stirToTurn();
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  console.log("Direction of concave part: " + radToDeg(vecToDirCoord(x2 - x1, y2 - y1)));
  const s1 = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  straighten(direction, "sun", { maxGrains: s1 });
  logAddStirCauldron(0.7);
  logAddPourSolvent(6.34);
  const s2 = Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36);
  console.log("Final salt after main pouring: " + (getTotalSun() + s2));
  logAddStirCauldron(9.7);
  console.log(
    "Final salt after last pouring: " +
      (getTotalSun() + Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36))
  );
  straighten(degToRad(48.5), "sun", { maxStir: 1.3, maxGrains: 825 - getTotalSun() });
  logAddStirCauldron(1.13);
  logAddSunSalt(1);
  console.log("least distance: " + stirToNearestTarget(Effects.Wine.Hallucinations));
}
