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
  radToDeg,
  getDirectionByVector,
  getBottlePolarAngle,
  getCurrentStirDirection,
  checkBase,
  straighten,
  getTotalMoon,
  getTotalSun,
} from "../main";
import { Salt } from "../main";

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
  straighten(getBottlePolarAngle() - degToRad(3), Salt.Sun, { maxStirLength: 1.35 });
  logAddStirCauldron(4.8);
  logAddSunSalt(42);
  logAddStirCauldron(1.25);
  logAddSunSalt(52);
  let x1 = currentPlot.pendingPoints[0].x;
  let y1 = currentPlot.pendingPoints[0].y;
  stirToTurn();
  let x2 = currentPlot.pendingPoints[0].x;
  let y2 = currentPlot.pendingPoints[0].y;
  straighten(getDirectionByVector(x2 - x1, y2 - y1), Salt.Sun, {
    maxStirLength: 4,
    maxGrains: Math.ceil((currentPlot.pendingPoints[0].angle + 180.01) / 0.36),
  });
  straighten(getDirectionByVector(x2 - x1, y2 - y1), Salt.Sun, {
    maxStirLength: 4.0,
    maxGrains: 315,
  });
  stirToTurn();
  console.log(radToDeg(getCurrentStirDirection()));
  straighten(degToRad(-169.5), Salt.Moon, { maxStirLength: 6.61 });
  logAddMoonSalt(239 - getTotalMoon());
  logAddStirCauldron(2.3);
  straighten(degToRad(155), Salt.Sun, { maxGrains: 1115 - getTotalSun() });
  console.log("Minimal health: " + stirToDangerZoneExit());
  logAddStirCauldron(1.41);
  logAddSunSalt(1);
  console.log("Minimal distance: " + stirToNearestTarget(3.66, -30.72));
}
