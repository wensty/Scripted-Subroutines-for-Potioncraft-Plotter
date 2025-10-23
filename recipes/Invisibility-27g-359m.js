import {
  logAddIngredient,
  logAddMoonSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  stirIntoVortex,
  stirToNearestTarget,
  degToRad,
  checkBase,
  straighten,
} from "../mainScript";
import { Salt, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

function beta() {
  checkBase("oil");
  logAddIngredient(Ingredients.Lifeleaf);
  logAddIngredient(Ingredients.Goodberry);
  const pre = 87;
  const dir = -8;
  logAddMoonSalt(pre);
  logAddIngredient(Ingredients.Lifeleaf);
  straighten(degToRad(dir), Salt.Moon, { maxGrains: 343 - pre });
  stirIntoVortex();
  logAddHeatVortex(3.8);
  stirIntoVortex(7.3);
  logAddHeatVortex(5.5);
  logAddStirCauldron(1.3);
  logAddHeatVortex(Infinity);
  straighten(degToRad(70), Salt.Moon, { maxGrains: 16, preStir: 5 });
  stirToNearestTarget(Effects.Oil.Invisibility, { preStir: 4.4 });
}
