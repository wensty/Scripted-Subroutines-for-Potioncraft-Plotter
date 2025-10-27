import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  stirIntoVortex,
  stirToTurn,
  stirToTarget,
  heatAndPourToEdge,
  derotateToAngle,
  getAngleEntity,
  checkBase,
  logError,
  logSalt,
} from "../mainScript";
import { Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const recipes = {
  r1: {
    title: "WildGrowth-47m-93s",
    desc: "",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { GraveTruffle: 1 },
    Salts: { MoonSalt: 47, SunSalt: 93 },
    script: () => {
      checkBase("water");
      logAddIngredient(Ingredients.GraveTruffle);
      logAddMoonSalt(47);
      stirIntoVortex();
      logAddHeatVortex(Infinity);
      stirIntoVortex();
      stirToTurn({ preStirLength: 3 });
      heatAndPourToEdge(3, 7);
      derotateToAngle(0);
      logAddHeatVortex(1.09);
      logAddSunSalt(93);
      console.log(getAngleEntity());
      stirIntoVortex();
      console.log(getAngleEntity() + Math.PI);
      heatAndPourToEdge(3, 6);
      logAddHeatVortex(0.3);
      stirIntoVortex();
      derotateToAngle(0);
      heatAndPourToEdge(3, 7);
      logAddHeatVortex(1.64);
      stirToTarget(Effects.Water.WildGrowth, { preStir: 3.3, maxStir: 0.2 });
    },
  },
};
