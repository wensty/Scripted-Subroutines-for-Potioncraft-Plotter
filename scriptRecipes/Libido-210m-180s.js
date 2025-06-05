import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToNearestTarget,
  getDirectionByVector,
  straighten,
  getTotalSun,
} from "../main";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function main() {
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddStirCauldron(5.8);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(45);
  logAddStirCauldron(9.8);
  logAddPourSolvent(1.66);
  logAddStirCauldron(1.84);
  let x = currentPlot.pendingPoints[0].x || 0.0;
  let y = currentPlot.pendingPoints[0].y || 0.0;
  straighten(getDirectionByVector(-17.67 - x, 3.61 - y), "sun", { maxStirLength: 0.56 });
  logAddSunSalt(179 - getTotalSun());
  logAddStirCauldron(2.503);
  logAddSunSalt(1);
  logAddStirCauldron(8.15);
  stirToNearestTarget(-17.67, 3.61);
  logAddMoonSalt(165);
}
