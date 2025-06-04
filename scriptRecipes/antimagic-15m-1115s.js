import {
  logAddIngredient,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  stirIntoVortex,
  stirToNearestTarget,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  saltToDeg,
  getDirectionByVector,
  checkBase,
  straighten,
} from "../main";
import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function main() {
  checkBase("oil");
  logAddSunSalt(28);
  logAddSunSalt(138);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 28));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(degToRad(17.4), "sun", { maxStirLength: 3 }); // Distance specified straightening.
  logAddStirCauldron(6);
  let direction = getDirectionByVector(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y
  );
  logAddSunSalt(37);
  logAddStirCauldron(3.3);
  // Salt specified straightening. Defalt option is not ignoring the reverse direction.
  straighten(direction + degToRad(+0.0), "sun", { maxGrains: 400, ignoreReverse: false });
  straighten(direction + degToRad(+0.0), "moon", { maxGrains: 15 });
  stirIntoVortex();
  heatAndPourToEdge(0.1, 33);
  logAddHeatVortex(2.28);
  derotateToAngle(saltToDeg("moon", 202 + 33));
  straighten(degToRad(11), "sun", { maxStirLength: 4, maxGrains: 201 });
  logAddStirCauldron(3.11);
  logAddSunSalt(1);
  console.log("path deviation: " + stirToNearestTarget(32.77, 29.94, 1.2));
}
