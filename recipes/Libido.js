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
  pourUntilAngle,
  degToRad,
  checkBase,
  straighten,
  getSun,
  setDisplay,
} from "../mainScript";
import { Entity, SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongLibido = { Libido: 3 };
const Libido = { Libido: 2 };
const WeakLibido = { Libido: 1 };

const recipes = {
  r1: {
    title: "Libido",
    desc: "Libido",
    version: "V3",
    base: BaseNames.Wine,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 210, SunSalt: 180 },
    Effects: StrongLibido,
    script: () => r1(),
  },
  r2: {
    title: "Libido",
    desc: "GraspingRoot Ver.",
    version: "betaV3",
    base: BaseNames.Wine,
    Ingredients: { GraspingRoot: 3 },
    Salts: { Moonsalt: 23, SunSalt: 62 },
    Effects: StrongLibido,
    script: r3,
  },
};

function r1() {
  checkBase(BaseNames.Wine);
  logSkirt();
  logAddStirCauldron(5.8);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(45);
  logAddStirCauldron(9.8);
  pourUntilAngle(-(20 - 11.99 + 15 * 0.36));
  stirToZone({ zone: Entity.HealZone, exitZone: true });
  straighten(degToRad(-103), SaltNames.Sun, { maxStir: 0.76 });
  logAddSunSalt(179 - getSun());
  logAddStirCauldron(0.411);
  logAddSunSalt(1);
  console.log(stirToTarget(Effects.Wine.Libido, { preStir: 9.6, maxStir: 1.0 }));
  logAddMoonSalt(165);
}

function r2() {
  setDisplay();
  logAddIngredient(Ingredients.GraspingRoot, 0.095);
  logAddSunSalt(64);
  logAddIngredient(Ingredients.GraspingRoot, 0.318);
  logAddIngredient(Ingredients.GraspingRoot);
  logAddPourSolvent(Infinity);
  stirToTurn({ preStir: 4 });
  logAddMoonSalt(2);
  logAddStirCauldron(7.64);
  logAddMoonSalt(20);
  logAddStirCauldron(0.184);
  logAddMoonSalt(1);
  stirToTarget(Effects.Wine.Libido, { preStir: 6.8, maxStir: 0.6 });
}

function r3() {
  checkBase(BaseNames.Wine);
  logAddSunSalt(62);
  logAddIngredient(Ingredients.GraspingRoot, 0.197);
  logAddIngredient(Ingredients.GraspingRoot, 0.4769);
  logAddStirCauldron(1.7);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(8);
  logAddIngredient(Ingredients.GraspingRoot);
  logAddMoonSalt(15);
  console.log(stirToTarget(Effects.Wine.Libido, { preStir: 21.0, maxStir: 1.0 }).distance);
}
