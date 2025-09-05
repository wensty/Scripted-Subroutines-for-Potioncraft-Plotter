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
} from "../main";
import { Salt, Effects } from "../main";

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
  straighten(degToRad(70), Salt.Moon, { maxGrains: 16, preStirLength: 5 });
  stirToNearestTarget(Effects.Oil.Invisibility, { preStirLength: 4.4 });
}
