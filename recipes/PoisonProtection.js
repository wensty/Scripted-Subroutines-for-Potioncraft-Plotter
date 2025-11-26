import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  degToRad,
  radToDeg,
  getAngleOrigin,
  getAngleEntity,
  straighten,
  vMag,
  getSun,
  getCoord,
} from "../mainScript";
import { SaltNames, BaseNames } from "../mainScript";

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
};

function r1() {
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
