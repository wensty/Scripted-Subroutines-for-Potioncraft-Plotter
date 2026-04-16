import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToTarget,
  derotateToAngle,
  radToDeg,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  getDeviation,
  straighten,
  getSun,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

const recipes = {
  r1: {
    title: "Light",
    desc: "Light",
    version: "betaV3",
    base: "water",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 206 },
    Effects: { Light: 1 },
    script: () => s1(),
  },
};

function s1() {
  checkBase("water");
  logAddSunSalt(13);
  logSkirt();
  // logAddStirCauldron(5.35)
  stirToTurn({ preStir: 5.33, directionBuffer: 0 });
  logAddPourSolvent(Infinity);
  const d1 = getStirDirection();
  stirIntoVortex();
  console.log("d1: " + radToDeg(d1));
  console.log("~>d1: " + (radToDeg(getAngleEntity()) - 90));
  logAddHeatVortex(4.5);
  logAddPourSolvent(1.31);
  logAddHeatVortex(3.62);
  const d2 = getHeatDirection();
  straighten(d2 - Math.PI / 2, SaltNames.Sun, { maxGrains: 206 - getSun(), preStir: 5 });
  stirIntoVortex(5);
  console.log("d2: " + radToDeg(d2));
  console.log("~d2: " + (radToDeg(getAngleEntity()) - 90));
  derotateToAngle(34);
  logAddHeatVortex(Infinity);
  stirIntoVortex(4.5);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1.36);
  stirToTarget(Effects.Water.Light, { preStir: 1.0, maxStir: 0.5 });
  console.log(getDeviation(Effects.Water.Light));
}
