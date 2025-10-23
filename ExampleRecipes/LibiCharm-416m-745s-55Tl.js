import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToNearestTarget,
  degToRad,
  checkBase,
  straighten,
  getTotalMoon,
  getTotalSun,
} from "../mainScript";
import { Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("wine");
  logAddIngredient(Ingredients.GraveTruffle, 1);
  logAddSunSalt(195);
  stirToTurn();
  straighten(degToRad(-81), "moon", { maxGrains: 298 });
  logAddMoonSalt(415 - getTotalMoon());
  logAddStirCauldron(1.09);
  logAddMoonSalt(1);
  logAddStirCauldron(3.7);
  stirToNearestTarget(Effects.Wine.Libido, { maxStir: 0.2 });
  logAddSunSalt(133);
  logAddPourSolvent(5.44);
  stirToTurn();
  logAddPourSolvent(2.99);
  stirToTurn();
  stirToTurn();
  stirToTurn();
  logAddSunSalt(745 - getTotalSun());
  logAddStirCauldron(Infinity);
}
