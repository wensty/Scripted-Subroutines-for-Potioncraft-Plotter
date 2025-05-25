import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  stirToTurn,
  stirToDangerZoneExit,
  stirToNearestTarget,
  derotateToAngle,
  degToRad,
  getDirectionByVector,
  getBottlePolarAngle,
  checkBase,
  straighten,
  getTotalMoon,
  getTotalSun,
} from "../main";
import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

/**
 * Lightning Protection-239m-1116s
 *
 * The first 156 moon salt is not optimal for length efficiency,
 * roughly 3 moon is pre-rotation to save sun.
 *
 * The 83 (actually 26) moon straighten the 3rd part.
 */
function main() {
  checkBase("oil");
  logAddMoonSalt(156);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(0);
  logAddStirCauldron(4.6);
  straighten(1.35, getBottlePolarAngle() - degToRad(3), "sun");
  logAddStirCauldron(4.8);
  logAddSunSalt(42);
  logAddStirCauldron(1.25);
  logAddSunSalt(52);
  let x1 = currentPlot.pendingPoints[0].x;
  let y1 = currentPlot.pendingPoints[0].y;
  stirToTurn();
  let x2 = currentPlot.pendingPoints[0].x;
  let y2 = currentPlot.pendingPoints[0].y;
  straighten(
    4,
    getDirectionByVector(x2 - x1, y2 - y1),
    "sun",
    Math.ceil((currentPlot.pendingPoints[0].angle + 180.01) / 0.36)
  );
  straighten(4, getDirectionByVector(x2 - x1, y2 - y1), "sun", 315);
  stirToTurn();
  straighten(6.61, degToRad(-169.5), "moon", 88);
  logAddMoonSalt(239 - getTotalMoon());
  logAddStirCauldron(2.3);
  straighten(Infinity, degToRad(154.5), "sun", 1115 - getTotalSun());
  console.log("Minimal health: " + stirToDangerZoneExit());
  logAddSunSalt(1);
  console.log("Minimal distance: " + stirToNearestTarget(3.66, -30.72));
}
