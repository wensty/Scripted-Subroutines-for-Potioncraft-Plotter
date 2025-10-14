import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToVortexEdge,
  stirToZone,
  stirToNearestTarget,
  stirToConsume,
  pourToZoneV2,
  derotateToAngle,
  radToDeg,
  getCurrentStirDirection,
  checkBase,
  straighten,
} from "../main";
import { Effects } from "../main";

import { Ingredients } from "@potionous/dataset";

const recipes = {
  r1: {
    title: "Explosion-water-salty",
    version: 3,
    desc: "",
    base: "water",
    tier: 3,
    RainbowCap: 1,
    MoonSalt: 103,
    SunSalt: 27,
    script: () => {
      checkBase("water");
      // setStirRounding(false)
      logAddIngredient(Ingredients.RainbowCap, 1);
      logAddStirCauldron(14.4);
      logAddPourSolvent(100);
      console.log("Current stir angle: " + radToDeg(getCurrentStirDirection()));
      logAddStirCauldron(3.75);
      let currentStirAngle = getCurrentStirDirection();
      console.log("Current stir angle: " + radToDeg(currentStirAngle));
      straighten(currentStirAngle, "moon", { maxStirLength: 10, maxGrains: 43 });
      stirIntoVortex(3.5);
      stirToConsume(8.2);
      derotateToAngle(0);
      logAddHeatVortex(3.7);
      // logAddPourSolvent(1.2)
      pourToZoneV2({ prePourLength: 1.0, maxPourLength: 0.5, overPour: true, exitZone: true });
      logAddHeatVortex(1.2);
      logAddPourSolvent(1.62);
      logAddHeatVortex(2.97);
      stirToVortexEdge();
      for (let i = 0; i < 6; i++) {
        stirToVortexEdge();
        logAddHeatVortex(0.1);
      }
      logAddHeatVortex(1.062);
      for (let i = 0; i < 18; i++) {
        stirToVortexEdge();
        logAddHeatVortex(0.1);
      }
      logAddHeatVortex(0.012);
      stirToZone({ overStir: true, exitZone: true });
      logAddMoonSalt(59);
      logAddStirCauldron(1.306);
      logAddMoonSalt(1);
      stirToNearestTarget(Effects.Water.Explosion, { preStirLength: 4.1, maxStirLength: 0.5 });
      logAddSunSalt(27);
    },
  },
};
