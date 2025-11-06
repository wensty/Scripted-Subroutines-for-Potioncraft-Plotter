import {
  logAddIngredient,
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTarget,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  vecToDirCoord,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getTotalSun,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

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
      const a1 = getStirDirection();
      const { x, y } = currentPlot.pendingPoints[0];
      const a2 = vecToDirCoord(-11.65 - x, -0.98 - y);
      console.log(a1);
      console.log(a2);
      console.log(radToDeg(a2));
      straighten(degToRad(-101), SaltNames.Sun, { maxGrains: 99 });
      logAddSunSalt(5);
      logAddStirCauldron(0.154);
      logAddSunSalt(1);
      stirToTarget(Effects.Oil.Fire);
      logAddSunSalt(156 - getTotalSun());
    },
  },
  r2: {
    title: "Fire",
    desc: "",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { Phantomskirt: 1 },
    Salts: { SunSalt: 117 },
    script: () => {
      checkBase("water");
      logSkirt();
      logAddStirCauldron(5.525);
      logAddPourSolvent(Infinity);
      console.log(radToDeg(getStirDirection()));
      stirIntoVortex();
      console.log(radToDeg(getAngleEntity()) - 90);
      logAddHeatVortex(3);
      logAddStirCauldron(4);
      stirToTurn();
      stirToTurn();
      logAddPourSolvent(4);
      heatAndPourToEdge(0.5, 6);
      logAddHeatVortex(0.196);
      for (let i = 0; i < 3; i++) {
        stirToTurn();
      }
      straighten(getStirDirection(), SaltNames.Sun, { maxStir: 0.8 });
      stirToDangerZoneExit();
      logAddSunSalt(117 - getTotalSun());
      logAddStirCauldron(0.335);
      // logAddHeatVortex(5)
      derotateToAngle(0);
      logAddHeatVortex(3.148);
      logAddStirCauldron(0.83);
      logAddHeatVortex(4.564);
      stirToTarget(Effects.Water.Fire, { preStir: 4 });
    },
  },
};
