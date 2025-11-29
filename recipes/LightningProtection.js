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
  logAddSetPosition,
  stirIntoVortex,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  derotateToAngle,
  degToRad,
  radToDeg,
  vecToDirCoord,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getMoon,
  getSun,
  BaseNames,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

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
  derotateToAngle(0);
  logAddStirCauldron(4.6);
  straighten(getAngleOrigin() - degToRad(3), SaltNames.Sun, { maxStir: 1.35 });
  logAddStirCauldron(4.8);
  logAddSunSalt(42);
  logAddStirCauldron(1.1);
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  logAddSunSalt(51);
  stirToTurn({ preStir: 3.3 });
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  const d = vecToDirCoord(x2 - x1, y2 - y1);
  straighten(d, SaltNames.Sun, {
    maxGrains: 815 - getSun(), // Empirical.
  });
  logAddStirCauldron(7.108);
  const m2 = 86;
  straighten(degToRad(170), SaltNames.Moon, { maxGrains: m1 + m2 - getMoon() });
  stirToDangerZoneExit();
  stirToZone({ overStir: false });
  straighten(degToRad(157.1), SaltNames.Sun, {
    maxGrains: 1000 + m2 + 33 - 1 - getSun(),
  });
  stirToDangerZoneExit();
  logAddStirCauldron(0.044);
  logAddSunSalt(1);
  console.log(
    "Minimal distance: " + stirToTarget(Effects.Oil.LightningProtection, { preStir: 3.0 }).distance
  );
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
