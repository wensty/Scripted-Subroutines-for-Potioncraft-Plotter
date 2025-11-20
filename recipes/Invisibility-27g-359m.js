import {
  logAddIngredient,
  logAddMoonSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  stirIntoVortex,
  stirToTarget,
  degToRad,
  checkBase,
  straighten,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongInvisibility = { Invisibility: 3 };
const Invisibility = { Invisibility: 2 };
const WeakInvisibility = { Invisibility: 1 };

const recipes = {
  r1: {
    title: "Invisibility",
    desc: "27g+359moon",
    Version: 3,
    base: BaseNames.Oil,
    Ingredients: { Lifeleaf: 2, Goodberry: 1 },
    Salts: { MoonSalt: 359 },
    Effect: StrongInvisibility,
    script: () => r1,
  },
};

function r1() {
  checkBase("oil");
  logAddIngredient(Ingredients.Lifeleaf);
  logAddIngredient(Ingredients.Goodberry);
  const pre = 87;
  const dir = -8;
  logAddMoonSalt(pre);
  logAddIngredient(Ingredients.Lifeleaf);
  straighten(degToRad(dir), SaltNames.Moon, { maxGrains: 343 - pre });
  stirIntoVortex();
  logAddHeatVortex(3.8);
  stirIntoVortex(7.3);
  logAddHeatVortex(5.5);
  logAddStirCauldron(1.3);
  logAddHeatVortex(Infinity);
  straighten(degToRad(70), SaltNames.Moon, { maxGrains: 16, preStir: 5 });
  stirToTarget(Effects.Oil.Invisibility, { preStir: 4.4 });
}
