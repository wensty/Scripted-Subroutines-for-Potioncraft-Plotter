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
} from "../main";

/**
 * LightningProtection-241m-1116s
 *
 * The first 157 moon salt is not optimal for length efficiency,
 * roughly 4 moon is pre-rotation to save sun.
 *
 * The 88 moon bending the 3rd part can also straighten the part.
 */
function main() {
  checkBase("oil");
  logAddMoonSalt(157);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(0);
  logAddStirCauldron(4.6);
  straighten(1.35, getBottlePolarAngle() - degToRad(3.6), "sun");
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
  stirToDangerZoneExit();
  straighten(3.4, degToRad(-169.6), "moon", 88);
  logAddMoonSalt(241 - TotalMoon);
  logAddStirCauldron(2.3);
  straighten(Infinity, degToRad(155), "sun", 1115 - TotalSun);
  stirToDangerZoneExit();
  logAddSunSalt(1);
  stirToNearestTarget(3.66, -30.72);
}
