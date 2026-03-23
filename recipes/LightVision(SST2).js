import {
  logAddIngredient,
  logAddIngredients,
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTarget,
  stirToConsume,
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  pourUntilAngle,
  degToRad,
  radToDeg,
  vecToDir,
  vecToDirCoord,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  getDeviation,
  getCoord,
  straighten,
  vSub,
  getSun,
  getStir,
  setVirtual,
  unsetVirtual,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

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
  r2: {
    title: "SST2",
    desc: "Ing-optimized",
    version: "BetaV3",
    base: BaseNames.Water,
    Ingredients: { PhantomSkirt: 2 },
    Salts: { SunSalt: 497 },
    Effects: SST2,
    script: () => r2(),
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
  console.log("distance: " + stirToTarget(Effects.Water.Light, { preStir: 1.0, maxStir: 1.0 }).distance);
  console.log(getDeviation(Effects.Water.Light).total);
  logAddSunSalt(t1 + t2 - getSun());
  logAddIngredient(Ingredients.Lifeleaf);
  logAddStirCauldron(1.33);
  // about to return
  logAddPourSolvent(Infinity);
  stirIntoVortex(19);
  logAddHeatVortex(6.356);
}

function r2() {
  const pre = 13;
  const target1 = 195;
  logAddSunSalt(pre);
  logSkirt();
  stirToTurn({ preStir: 5.33, directionBuffer: 0 });
  logAddPourSolvent(Infinity);
  const d1 = getStirDirection();
  console.log("d1: " + radToDeg(d1));
  stirIntoVortex(5);
  console.log("~d1: " + (radToDeg(getAngleEntity()) - 90));
  logAddHeatVortex(4.5);
  logAddPourSolvent(1.31);
  logAddHeatVortex(3.785);
  const d2 = getHeatDirection();
  console.log("d2: " + radToDeg(d2));
  straighten(d2 - Math.PI / 2, SaltNames.Sun, { preStir: 3, maxGrains: target1 - pre });
  stirIntoVortex(4);
  console.log("~d2: " + (radToDeg(getAngleEntity()) - 90));

  // Aligning + Return

  derotateToAngle(43.8);
  logAddHeatVortex(Infinity);
  stirIntoVortex(2);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(0.53);
  setVirtual();
  stirToTarget(Effects.Water.Light, { maxStir: 3 });
  console.log("deviation<600%: " + getDeviation(Effects.Water.Light).total);
  unsetVirtual();
  logAddStirCauldron(2.98);
  pourUntilAngle(97 * 0.36);
  console.log("total stir:" + getStir());
  logSkirt();

  // part 2

  logAddPourSolvent(Infinity);
  logAddSunSalt(99);
  stirToTurn();
  const c1 = getCoord();
  console.log(vecToDir(c1));
  logAddSunSalt(57);
  logAddStirCauldron(4.55);
  const c2 = getCoord();
  console.log(vecToDir(vSub(c2, c1)));
  console.log(getStirDirection());
  straighten(degToRad(115), SaltNames.Sun, { maxGrains: target1 + 302 - getSun() });

  // MagicVision

  stirToTurn({ preStir: 12.2 });
  logAddHeatVortex(3);
  stirToConsume(10.26);
  derotateToAngle(0);
  pourToVortexEdge();
  heatAndPourToEdge(1, 11);
  logAddHeatVortex(2.51);
  stirToDangerZoneExit(2);
  logAddPourSolvent(0.11);
}
