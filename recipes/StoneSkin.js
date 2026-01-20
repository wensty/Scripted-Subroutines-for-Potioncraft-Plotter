import {
  logAddIngredient,
  logAddHeatVortex,
  stirIntoVortex,
  stirToVortexEdge,
  stirToConsume,
  pourToVortexEdge,
  heatAndPourToEdge,
  stirToTarget,
  Effects,
  checkBase,
} from "../mainScript";

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
    title: "StoneSkin",
    desc: "",
    version: 3,
    base: "water",
    Ingredients: { DryadsSaddle: 2 },
    Salts: { MoonSalt: 27 },
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
  checkBase("water");
  const target = 27;
  logAddIngredient(Ingredients.DryadsSaddle);
  // logAddStirCauldron(0.)
  stirToTurn({ preStir: 0.27, directionBuffer: 0 });
  logAddPourSolvent(Infinity);
  const d1 = getStirDirection();
  const angle = 171.28;
  straighten(degToRad(angle), SaltNames.Moon, { preStir: 3, maxGrains: target });
  logAddIngredient(Ingredients.DryadsSaddle);
  stirToTurn({ preStir: 7.4, directionBuffer: 200 * SaltAngle });
  stirIntoVortex(1.0);
  console.log("~d: " + (angle - 180));
  console.log("<d: " + (radToDeg(d1) + 90));
  console.log("d: " + radToDeg(getAngleEntity()));
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  stirToDangerZoneExit(3);
  logAddHeatVortex(Infinity);
}
