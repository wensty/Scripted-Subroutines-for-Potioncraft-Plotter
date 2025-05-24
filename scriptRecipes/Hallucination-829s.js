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
} from "../main";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function main() {
  checkBase("wine");
  logAddSunSalt(69);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 50 - 0.9));
  const direction = degToRad(28.5);
  straighten(Infinity, direction, "sun", 168);
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  logAddStirCauldron(7);
  stirToTurn();
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  console.log("Direction of concave part: " + radToDeg(getDirectionByVector(x2 - x1, y2 - y1)));
  const s1 = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  straighten(Infinity, direction, "sun", s1);
  logAddStirCauldron(0.8);
  logAddPourSolvent(6.3);
  const s2 = Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36);
  console.log("Final salt after main pouring: " + (getTotalSun() + s2));
  logAddStirCauldron(9.7);
  console.log(
    "Final salt after last pouring: " +
      (getTotalSun() + Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36))
  );
  straighten(1, degToRad(55), "sun", 828 - getTotalSun());
  logAddStirCauldron(0.51);
  logAddSunSalt(1);
  console.log("least distance: " + stirToNearestTarget(19.25, 16.3));
}
