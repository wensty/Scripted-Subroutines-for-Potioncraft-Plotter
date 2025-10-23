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
  stirToNearestTarget,
  derotateToAngle,
  degToRad,
  radToDeg,
  vecToDirCoord,
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
  getTotalMoon,
  getTotalSun,
} from "../mainScript";
import { Salt, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "LightningProtection",
    desc: "",
    version: 3,
    base: "oil",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 242, SunSalt: 1119 },
    script: () => {
      checkBase("oil");
      const m1 = 156; // pre-rotation
      logAddMoonSalt(m1);
      logSkirt();
      derotateToAngle(0);
      logAddStirCauldron(4.6);
      straighten(getBottlePolarAngle() - degToRad(3), Salt.Sun, { maxStir: 1.35 });
      logAddStirCauldron(4.8);
      logAddSunSalt(42);
      logAddStirCauldron(1.25);
      logAddSunSalt(51);
      const x1 = currentPlot.pendingPoints[0].x;
      const y1 = currentPlot.pendingPoints[0].y;
      stirToTurn();
      const x2 = currentPlot.pendingPoints[0].x;
      const y2 = currentPlot.pendingPoints[0].y;
      const d = vecToDirCoord(x2 - x1, y2 - y1);
      straighten(d, Salt.Sun, {
        maxStir: 4,
        maxGrains: Math.ceil((currentPlot.pendingPoints[0].angle + 180.01) / 0.36),
      });
      straighten(d, Salt.Sun, {
        maxStir: 4.0,
        maxGrains: 315,
      });
      stirToTurn({ preStirLength: 0.6 });
      console.log(radToDeg(getCurrentStirDirection()));
      straighten(degToRad(-167), Salt.Moon, {
        preStir: 3.9,
        maxStir: 2.637,
        maxGrains: 88,
      });
      const m2 = 86; // unrolling.
      // logAddMoonSalt(m1 + m2 - getTotalMoon());
      straighten(degToRad(170), Salt.Moon, { maxGrains: m1 + m2 - getTotalMoon() });
      stirToDangerZoneExit();
      stirToZone({ overStir: false });
      straighten(degToRad(156.9), Salt.Sun, {
        maxGrains: 1000 + m2 + 33 - 1 - getTotalSun(),
      });
      stirToDangerZoneExit();
      logAddStirCauldron(0);
      logAddSunSalt(1);
      console.log(
        "Minimal distance: " +
          stirToNearestTarget(Effects.Oil.LightningProtection, { preStir: 3.0 })
      );
      logAddSetPosition(3.66, -30.72);
    },
  },
  r2: {
    title: "LightningProtection-Water",
    desc: `moon: 156+86=242
    sun: 1000+86+33=1119`,
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: {
      PhantomSkirt: 2,
    },
    Salts: {
      SunSalt: 916,
      LifeSalt: 80,
    },
    script: () => {
      checkBase("water");
      logSkirt(0.258);
      logSkirt();
      logAddSunSalt(310);
      straighten(degToRad(180), Salt.Sun, { preStir: 4.8, maxGrains: 125 });
      stirIntoVortex(2.6);
      console.log("~0:" + getBottlePolarAngleByEntity());
      logAddHeatVortex(Infinity);
      stirIntoVortex(3.2);
      logAddHeatVortex(Infinity);
      straighten(degToRad(150), Salt.Sun, { preStir: 9.6, maxGrains: 39 });
      stirIntoVortex(4.6);
      logAddSunSalt(501 - getTotalSun());
      derotateToAngle(189 * 0.36, { toAngle: false });
      logAddHeatVortex(Infinity);
      straighten(degToRad(-141.5), Salt.Sun, { preStir: 5.522, ignoreReverse: false });
      stirToDangerZoneExit();
      logAddPourSolvent(0.82); // empirical
      logAddSunSalt(35);
      console.log(
        "centering:" +
          stirToNearestTarget(Effects.Water.LightningProtection, {
            preStir: 9.2,
            maxStir: 0.5,
          })
      );
    },
  },
};
