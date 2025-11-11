/**
 * Full import script.
 */

import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  stirIntoVortex,
  stirToTurn,
  stirToTarget,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  degToSalt,
  saltToDeg,
  vecToDir,
  getAngleEntity,
  checkBase,
  straighten,
  vSub,
  getCoord,
  setVirtual,
  unsetVirtual,
  setDisplay,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Antimagic",
    desc: "Antimagic",
    version: 3,
    base: "oil",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { Moonsalt: 8, SunSalt: 1112 },
    script: () => r1(),
  },
};

function r1() {
  checkBase("oil");
  setDisplay(false);
  logAddSunSalt(26);
  logAddSunSalt(141);
  logSkirt();
  derotateToAngle(saltToDeg(SaltNames.Sun, 26));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(degToRad(17.6), SaltNames.Sun, { maxStir: 3 }); // Distance specified straightening.
  logAddStirCauldron(6.2);
  logAddSunSalt(52);
  logAddStirCauldron(0.7);
  logAddSunSalt(2);
  const p1 = getCoord();
  stirToTurn();
  const p2 = getCoord();
  let direction = vecToDir(vSub(p2, p1));
  console.log(direction);
  straighten(direction, SaltNames.Sun, { maxGrains: 371, ignoreReverse: false });
  straighten(direction, SaltNames.Moon, { maxGrains: 8 });
  stirIntoVortex();
  console.log(getAngleEntity() + Math.PI);
  heatAndPourToEdge(0.1, 30);
  logAddHeatVortex(2.64);
  console.log(degToSalt(currentPlot.pendingPoints[0].angle));
  derotateToAngle(saltToDeg("moon", 207) - 11.99);
  straighten(degToRad(11), SaltNames.Sun, { maxStir: 4, maxGrains: 206 });
  for (let d = 0.94; d < 0.97; d += 0.001) {
    setVirtual();
    logAddStirCauldron(d);
    logAddSunSalt(1);
    console.log(d);
    console.log(stirToTarget(Effects.Oil.AntiMagic));
  } // search for optimal stir length to center.
  unsetVirtual();
  logAddStirCauldron(0.964);
  logAddSunSalt(1);
  setDisplay();
  stirToTarget(Effects.Oil.AntiMagic, { preStir: 3 });
}
