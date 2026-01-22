import {
  logAddIngredient,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToVortexEdge,
  stirToDangerZoneExit,
  stirToTarget,
  stirToConsume,
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getMoon,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongStoneSkin = { StoneSkin: 3 };
const StoneSkin = { StoneSkin: 2 };
const WeakStoneSkin = { StoneSkin: 1 };

const recipes = {
  r1: {
    title: "StoneSkin-classic",
    desc: "Interesing recipe from CN community.",
    version: 3,
    base: "water",
    Ingredients: { Goldthorn: 1, DruidsRosemary: 1 },
    Salts: {},
    Effects: StrongStoneSkin,
    script: r1,
  },
  r2: {
    title: "StoneSkin-classic",
    desc: "chunk version",
    version: "BetaV3",
    base: BaseNames.Water,
    Ingredients: { DryadsSaddle: 2 },
    Salts: { MoonSalt: 25, addSunSalt: 2 },
    Effects: StrongStoneSkin,
    script: r2,
  },
};

function r1() {
  checkBase("water");
  logAddIngredient(Ingredients.Goldthorn, 0.774);
  logAddIngredient(Ingredients.DruidsRosemary);
  stirIntoVortex();
  stirToConsume(11.12);
  logAddHeatVortex(Infinity);
  stirIntoVortex();
  logAddHeatVortex(2);
  pourToVortexEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(2);
  for (let i = 0; i < 10; i++) {
    stirToVortexEdge();
    logAddHeatVortex(0.1);
  }
  logAddHeatVortex(1.4);
  stirToTarget(Effects.Water.StoneSkin);
}
function r2() {
  checkBase(BaseNames.Water);
  logAddIngredient(Ingredients.DryadsSaddle);
  logAddStirCauldron(0.301);
  console.log("<=:" + (radToDeg(getStirDirection()) + 270));
  logAddPourSolvent(Infinity);
  const target = 25;
  const total = 27;
  straighten(degToRad(170.15), SaltNames.Moon, { preStir: 3, maxGrains: target });
  logAddIngredient(Ingredients.DryadsSaddle);
  stirIntoVortex(9);
  console.log(radToDeg(getAngleEntity()) + 180);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddSunSalt(total - getMoon());
  stirToDangerZoneExit();
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(0.19);
}
