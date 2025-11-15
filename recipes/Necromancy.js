import {
  logAddIngredient,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToZone,
  stirToTarget,
  degToRad,
  radToDeg,
  getStirDirection,
  checkBase,
  straighten,
  getTotalMoon,
  getTotalSun,
  setPreStir,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const recipes = {
  r1: {
    title: "Necromancy",
    desc: "467m-46s",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { GraveTruffle: 1 },
    Salts: { MoonSalt: 467, SunSalt: 46, LifeSalt: 19 },
    script: r1(),
  },
  r2: {
    title: "Necromancy",
    desc: "",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 664 },
    script: r2(),
  },
};

function r1() {
  checkBase("wine");
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
  stirToTarget(Effects.Wine.Necromancy, { preStir: 9 });
}

function r2() {
  checkBase("wine");
  logAddSunSalt(197);
  logSkirt();
  logAddStirCauldron(3);
  logAddPourSolvent(Infinity);
  logAddStirCauldron(2.7);
  logAddPourSolvent(Infinity);
  console.log(radToDeg(getStirDirection()));
  stirToZone({ preStir: 8.4 });
  for (let i = 0; i < 13; i++) {
    logAddPourSolvent(0.1);
    stirToZone();
  }
  straighten(degToRad(-151.2), SaltNames.Sun, { maxGrains: 187 });
  straighten(degToRad(-171), SaltNames.Sun, { preStir: 8.5, maxGrains: 222 });
  logAddStirCauldron(3.045);
  logAddSunSalt(1);
  stirToTarget(Effects.Wine.Necromancy);
  logAddSunSalt(664 - getTotalSun());
}
