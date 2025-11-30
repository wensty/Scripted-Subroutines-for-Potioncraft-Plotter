/**
 * Full import script.
 */

import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  derotateToAngle,
  degToRad,
  vecToDir,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  vSub,
  getMoon,
  getSun,
  getStir,
  getCoord,
  logAddSetPosition,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

const StrongLightningProtection = { LightningProtection: 3 };
const LightningProtection = { LightningProtection: 2 };
const WeakLightningProtection = { LightningProtection: 1 };

const recipes = {
  r1: {
    title: "LightningProtection",
    desc: "",
    version: "betaV3",
    base: BaseNames.Oil,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 242, SunSalt: 1119 },
    Effects: StrongLightningProtection,
    script: r1,
  },
  r2: {
    title: "LightningProtection-Water",
    desc: "",
    version: "V3",
    base: BaseNames.Water,
    Ingredients: { PhantomSkirt: 2 },
    Salts: { SunSalt: 916, LifeSalt: 80 },
    script: r2,
  },
};

function r1() {
  checkBase(BaseNames.Oil);
  const m1 = 156;
  logAddMoonSalt(m1);
  logSkirt();
  logAddPourSolvent(Infinity);
  logAddStirCauldron(4.38);
  const c1 = getCoord();
  const a1 = getStirDirection();
  straighten(a1, SaltNames.Sun, { maxGrains: 364 });
  logAddStirCauldron(4.8);
  const c2 = getCoord();
  console.log("a1: " + a1);
  console.log("~a1: " + vecToDir(vSub(c2, c1)));
  logAddSunSalt(42);
  logAddStirCauldron(1.14);
  console.log("Stir: " + getStir());
  const c3 = getCoord();
  logAddSunSalt(54);
  stirToTurn({ preStir: 3.3 });
  const c4 = getCoord();
  const d = vecToDir(vSub(c4, c3));
  straighten(d, SaltNames.Sun, {
    maxGrains: 815 - getSun(), // Empirical.
    logAuxLine: true,
  });
  logAddStirCauldron(7.166);
  const m2 = 85;
  straighten(degToRad(169.5), SaltNames.Moon, { maxGrains: m1 + m2 - getMoon(), logAuxLine: true });
  stirToDangerZoneExit();
  stirToZone({ overStir: false });
  straighten(degToRad(157.3), SaltNames.Sun, {
    maxGrains: 1000 + m2 + 33 - 1 - getSun(),
    logAuxLine: true,
  });
  stirToDangerZoneExit();
  logAddStirCauldron(0.245);
  logAddSunSalt(1);
  console.log("Minimal distance: " + stirToTarget(Effects.Oil.LightningProtection).distance);
}

function r2() {
  checkBase(BaseNames.Water);
  logSkirt(0.258);
  logSkirt();
  logAddSunSalt(310);
  straighten(degToRad(180), SaltNames.Sun, { preStir: 4.8, maxGrains: 125 });
  stirIntoVortex(2.6);
  console.log("~0:" + getAngleEntity());
  logAddHeatVortex(Infinity);
  stirIntoVortex(3.2);
  logAddHeatVortex(Infinity);
  straighten(degToRad(150), SaltNames.Sun, { preStir: 9.6, maxGrains: 39 });
  stirIntoVortex(4.6);
  logAddSunSalt(501 - getSun());
  derotateToAngle(189 * 0.36, { toAngle: false });
  logAddHeatVortex(Infinity);
  straighten(degToRad(-141.5), SaltNames.Sun, { preStir: 5.522, ignoreReverse: false });
  stirToDangerZoneExit();
  logAddPourSolvent(0.82); // empirical
  logAddSunSalt(35);
  console.log(
    "centering error:" +
      stirToTarget(Effects.Water.LightningProtection, {
        preStir: 9.2,
        maxStir: 0.5,
      }).distance
  );
}
