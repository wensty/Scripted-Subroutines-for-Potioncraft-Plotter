import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTarget,
  derotateToAngle,
  degToRad,
  radToDeg,
  getAngleOrigin,
  getAngleEntity,
  checkBase,
  straighten,
  vMag,
  getSun,
  getCoord,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const StrongPoisonProtection = { PoisonProtection: 3 };
const PoisonProtection = { PoisonProtection: 2 };
const WeakPoisonProtection = { PoisonProtection: 1 };

const recipes = {
  r1: {
    title: "Poison Protection",
    desc: "Poison Protection",
    version: 3,
    base: BaseNames.Oil,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 739 },
    Effects: StrongPoisonProtection,
    script: r1,
  },
  r2: {
    title: "Poison Protection",
    desc: "Poison Protection",
    version: 3,
    base: BaseNames.Water,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 1145, LifeSalt: 112 },
    Effects: StrongPoisonProtection,
    script: r2,
  },
};

function r1() {
  checkBase(BaseNames.Oil);
  logSkirt();
  logAddSunSalt(157);
  logAddStirCauldron(4.6);
  const d1 = getAngleOrigin();
  straighten(d1, SaltNames.Sun, { maxGrains: 520 - getSun() });
  logAddStirCauldron(4.67);
  console.log("d1: " + radToDeg(d1));
  console.log("~d1 " + radToDeg(getAngleOrigin()));
  logAddSunSalt(39);
  logAddStirCauldron(1.1);
  logAddSunSalt(18);
  stirToTurn({ preStir: 3.4 });
  logAddSunSalt(32);
  const s = Math.floor((currentPlot.committedPoints.at(-1).angle - vMag(getCoord()) * 9.0) / 0.36);
  console.log("s>0: " + s);
  stirToTurn();
  logAddPourSolvent(1.412);
  straighten(degToRad(-168), SaltNames.Sun, { maxGrains: 739 - getSun() });
  stirIntoVortex(10.6);
  console.log(radToDeg(getAngleEntity()) - 180);
}

function r2() {
  checkBase(BaseNames.Water);
  logSkirt();
  logAddSunSalt(262);
  stirToTurn({ preStir: 4.53, directionBuffer: 0 });
  const d1 = getAngleOrigin();
  straighten(d1, SaltNames.Sun, { maxGrains: 447 - getSun() });
  stirIntoVortex(1.5);
  console.log("d1: " + radToDeg(d1));
  console.log("~d1: " + (radToDeg(getAngleEntity()) - 180));
  logAddHeatVortex(Infinity);
  stirIntoVortex(3.3);
  derotateToAngle(19, { toAngle: false });
  logAddHeatVortex(Infinity);
  stirToTurn({ preStir: 4.7 });
  straighten(degToRad(85.88), SaltNames.Sun, { maxGrains: 280, maxStir: 2.313 });
  straighten(degToRad(123.3), SaltNames.Sun, {
    maxGrains: 131,
    ignoreReverse: false,
    logAuxLine: true,
  });
  // logAddStirCauldron(Infinity);
  straighten(degToRad(79.8), SaltNames.Sun, { preStir: 9.6, maxGrains: 220, logAuxLine: true });
  stirToDangerZoneExit(2.2);
  logAddPourSolvent(1.212);
  // logAddStirCauldron(Infinity);
  logAddStirCauldron(1.834);
  logAddSunSalt(1);
  console.log(stirToTarget(Effects.Water.PoisonProtection).distance);
  logAddSunSalt(99);
}
