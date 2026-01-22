import {
  logAddIngredient,
  logAddIngredients,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTarget,
  stirToConsume,
  derotateToAngle,
  degToRad,
  radToDeg,
  vecToDirCoord,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  getDeviation,
  getCoord,
  straighten,
  getSun,
  BaseNames,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const SST2 = { Light: 2, MagicVision: 3 };

const recipes = {
  r1: {
    title: "SST2",
    desc: "Cost-optimized",
    version: "BetaV3",
    base: BaseNames.Water,
    Ingredients: { Poopshroom: 1, SulphurShelf: 1, DryadsSaddle: 1, Lifeleaf: 4 },
    Salts: { SunSalt: 278 },
    Effects: SST2,
    script: () => r1(),
  },
};

function r1() {
  checkBase("water");
  const t1 = 213;
  logAddIngredient(Ingredients.Poopshroom);
  logAddStirCauldron(12.2);
  logAddPourSolvent(Infinity);
  const delay1 = 55; // not important.
  logAddSunSalt(delay1);
  logAddIngredient(Ingredients.SulphurShelf, 0.916);
  logAddSunSalt(151 - getSun());
  console.log("d: " + getStirDirection());
  logAddStirCauldron(6.103);
  console.log("~d: " + getHeatDirection());
  logAddHeatVortex(4.596);
  logAddStirCauldron(1.328);
  logAddHeatVortex(1.55);
  const pre = 20; // more path to vortex jumping and higher rotation of saddle.
  const dir = 76; // to ensure entering the vortex.
  straighten(degToRad(-dir), SaltNames.Sun, { preStir: 15.0, maxGrains: t1 - pre - getSun() });
  logAddIngredient(Ingredients.DryadsSaddle);
  straighten(degToRad(-dir), SaltNames.Sun, { maxGrains: pre });
  stirIntoVortex(5);
  console.log(radToDeg(getAngleEntity()) - 180);
  logAddIngredients(Ingredients.Lifeleaf, [1, 0.868]);

  // part 2

  const t2 = 65;
  derotateToAngle(pre * 0.36, { toAngle: false });
  stirToConsume(4.09);
  logAddHeatVortex(Infinity);
  const { x, y } = getCoord();
  console.log("d2:" + vecToDirCoord(-26.28 - x, 6.25 - y));
  console.log("<d2: " + (getStirDirection() - 1.5 * Math.PI));
  stirIntoVortex(5);
  console.log("%~d2: " + (getAngleEntity() - Math.PI));
  logAddHeatVortex(Infinity);
  logAddPourSolvent(0.8);
  logAddIngredient(Ingredients.Lifeleaf);
  logAddSunSalt(12);
  console.log(
    "distance: " + stirToTarget(Effects.Water.Light, { preStir: 1.0, maxStir: 1.0 }).distance
  );
  console.log(getDeviation(Effects.Water.Light).total);
  logAddSunSalt(t1 + t2 - getSun());
  logAddIngredient(Ingredients.Lifeleaf);
  logAddStirCauldron(1.33);
  // about to return
  logAddPourSolvent(Infinity);
  stirIntoVortex(19);
  logAddHeatVortex(6.356);
}
