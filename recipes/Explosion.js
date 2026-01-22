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
  stirToTarget,
  stirToConsume,
  pourToZoneV2,
  derotateToAngle,
  radToDeg,
  getStirDirection,
  checkBase,
  straighten,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongExplosion = { Explosion: 3 };
const Explosion = { Explosion: 2 };
const WeakExplosion = { Explosion: 1 };

const recipes = {
  r1: {
    title: "Explosion-water-salty",
    version: 3,
    desc: "",
    base: BaseNames.Water,
    Ingredients: { RainbowCap: 1 },
    Salts: { MoonSalt: 103, SunSalt: 27 },
    Effects: StrongExplosion,
    script: r1,
  },
  r2: {
    title: "Explosion-cost-optimized",
    version: "BetaV3",
    desc: "",
    base: BaseNames.Water,
    Ingredients: { Poopshroom: 1, Firebell: 1 },
    Salts: { MoonSalt: 66, SunSalt: 338 },
    Effects: StrongExplosion,
    script: r2,
  },
};

function r1() {
  checkBase("water");
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(14.4);
  logAddPourSolvent(100);
  console.log("Current stir angle: " + radToDeg(getStirDirection()));
  logAddStirCauldron(3.75);
  let currentStirAngle = getStirDirection();
  console.log("Current stir angle: " + radToDeg(currentStirAngle));
  straighten(currentStirAngle, SaltNames.Moon, { maxStir: 10, maxGrains: 43 });
  stirIntoVortex(3.5);
  stirToConsume(8.2);
  derotateToAngle(0);
  logAddHeatVortex(3.7);
  pourToZoneV2({ prePour: 1.0, maxPour: 0.5, overPour: true, exitZone: true });
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
  stirToTarget(Effects.Water.Explosion, { preStir: 4.1, maxStir: 0.5 });
  logAddSunSalt(27);
}

function r2() {
  checkBase(BaseNames.Water);
  const target = 66;
  logAddMoonSalt(target);
  logAddIngredient(Ingredients.Poopshroom);
  logAddIngredient(Ingredients.Firebell);
  // derotateToAngle(0)
  logAddPourSolvent(Infinity);
  logAddSunSalt(404 - target);
  stirIntoVortex(12);
  logAddHeatVortex(3.4);
  logAddPourSolvent(1.2);
  logAddHeatVortex(1.2);
  logAddPourSolvent(1.28);
  logAddHeatVortex(5.1);
  derotateToAngle(11.857);
  console.log(stirToTarget(Effects.Water.Explosion, { preStir: 10, maxStir: 0.6 }).distance);
}
