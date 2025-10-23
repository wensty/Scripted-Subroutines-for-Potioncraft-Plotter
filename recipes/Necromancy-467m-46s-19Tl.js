import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToNearestTarget,
  degToRad,
  straighten,
  getTotalMoon,
} from "../mainScript";
import { Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

function beta() {
  logAddSunSalt(46);
  logAddIngredient(Ingredients.GraveTruffle);
  logAddPourSolvent(Infinity);
  stirToTurn(4.2);
  straighten(degToRad(-125), "moon", { maxStir: 8 });
  stirToTurn(0);
  logAddMoonSalt(130);
  logAddStirCauldron(0.4);
  logAddMoonSalt(1);
  logAddStirCauldron(0.452);
  logAddMoonSalt(467 - getTotalMoon());
  stirToNearestTarget(Effects.Wine.Necromancy, { preStir: 9 });
}
