import {
  logAddIngredient,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToNearestTarget,
  derotateToAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  getDirectionByVector,
  getBottlePolarAngle,
  checkBase,
  straighten,
  getTotalSun,
  setDisplay,
} from "../main";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("wine");
  setDisplay(false);
  logAddSunSalt(70);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 53 - 0.9));
  const direction = degToRad(28.4);
  straighten(Infinity, direction, "sun", 167);
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  logAddStirCauldron(7);
  stirToTurn();
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  console.log("Direction of concave part: " + radToDeg(getDirectionByVector(x2 - x1, y2 - y1)));
  const s1 = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  straighten(Infinity, direction, "sun", s1);
  logAddStirCauldron(0.7);
  logAddPourSolvent(6.34);
  const s2 = Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36);
  console.log("Final salt after main pouring: " + (getTotalSun() + s2));
  logAddStirCauldron(9.7);
  console.log(
    "Final salt after last pouring: " +
      (getTotalSun() + Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36))
  );
  straighten(1.3, degToRad(48.5), "sun", 825 - getTotalSun());
  logAddStirCauldron(1.13);
  logAddSunSalt(1);
  console.log("least distance: " + stirToNearestTarget(19.25, 16.3));
}
