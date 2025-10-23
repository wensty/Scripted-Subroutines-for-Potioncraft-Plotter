import {
  logAddIngredient,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToNearestTarget,
  degToRad,
  radToDeg,
  vecToDirCoord,
  getCurrentStirDirection,
  straighten,
  getTotalSun,
  checkBase,
} from "../mainScript";
import { Salt, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Fire",
    desc: "",
    version: 3,
    base: "oil",
    tier: 3,
    Ingredients: { MagmaMorel: 1 },
    Salts: { SunSalt: 156 },
    script: () => {
      checkBase("oil");
      logAddSunSalt(22);
      logAddIngredient(Ingredients.MagmaMorel);
      logAddPourSolvent(Infinity);
      logAddStirCauldron(4.9);
      const a1 = getCurrentStirDirection();
      const { x, y } = currentPlot.pendingPoints[0];
      const a2 = vecToDirCoord(-11.65 - x, -0.98 - y);
      console.log(a1);
      console.log(a2);
      console.log(radToDeg(a2));
      straighten(degToRad(-101), Salt.Sun, { maxGrains: 99 });
      logAddSunSalt(5);
      logAddStirCauldron(0.154);
      logAddSunSalt(1);
      stirToNearestTarget(Effects.Oil.Fire);
      logAddSunSalt(156 - getTotalSun());
    },
  },
};
