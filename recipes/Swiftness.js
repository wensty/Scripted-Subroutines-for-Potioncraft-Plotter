import {
  logAddIngredient,
  logAddMoonSalt,
  logAddStirCauldron,
  stirToTarget,
  checkBase,
  getMoon,
} from "../mainScript";
import { BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongSwiftness = { Swiftness: 3 };
const Swiftness = { Swiftness: 2 };
const WeakSwiftness = { Swiftness: 1 };

const recipes = {
  r1: {
    title: "Swiftness",
    desc: "cost-optimized",
    version: "V3Beta",
    base: "wine",
    Ingredients: { Windbloom: 1, WitchMushroom: 1 },
    Salts: { MoonSalt: 92 },
    effect: StrongSwiftness,
    script: r1,
  },
};

function r1() {
  checkBase(BaseNames.Wine);
  const pre = 35;
  logAddIngredient(Ingredients.Windbloom);
  logAddMoonSalt(pre);
  logAddIngredient(Ingredients.WitchMushroom);
  logAddMoonSalt(63 - getMoon());
  logAddStirCauldron(11.109);
  logAddMoonSalt(1);
  console.log(stirToTarget(Effects.Wine.Swiftness, { preStir: 1.2 }).distance);
  logAddMoonSalt(92 - getMoon());
}
