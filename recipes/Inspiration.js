import {
  logAddIngredient,
  logSkirt,
  logAddMoonSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  pourToZoneV2,
  degToRad,
  radToDeg,
  vecToDirCoord,
  checkBase,
  straighten,
  getTotalSun,
} from "../mainScript";
import { Entity, Salt } from "../mainScript";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Inspiration",
    desc: "Shorter skirt path and more pouring near origin?",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { PhantomSkirt: 1, FrostSapphire: 1 },
    Salts: { MoonSalt: 304, SunSalt: 349 },
    script: () => {
      checkBase("wine");
      logSkirt(0.782);
      // logAddIngredient(Ingredients.FrostSapphire)
      logAddStirCauldron(1.5);
      logAddPourSolvent(Infinity);
      straighten(degToRad(34.4), Salt.Sun, { preStir: 3.5, maxGrains: 166 });
      const { x: x1, y: y1 } = currentPlot.pendingPoints[0];
      stirToTurn({ preStirLength: 9 });
      const { x: x2, y: y2 } = currentPlot.pendingPoints[0];
      console.log(radToDeg(vecToDirCoord(x2 - x1, y2 - y1)));
      straighten(degToRad(-19.7), Salt.Sun, { maxGrains: 349 - getTotalSun() });
      logAddStirCauldron(8.6);
      // along the skull near origin.
      for (let i = 0; i < 7; i++) {
        pourToZoneV2({ zone: Entity.StrongDangerZone, overPour: false, maxPour: 0.4 });
        logAddStirCauldron(0.148);
      }
      logAddStirCauldron(Infinity);
      logAddIngredient(Ingredients.FrostSapphire);
      logAddMoonSalt(277);
      logAddPourSolvent(0.004);
      logAddStirCauldron(1);
      logAddPourSolvent(0.404);
      logAddMoonSalt(27);
    },
  },
};
