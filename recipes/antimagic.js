/**
 * Full import script.
 */

import {
  logAddIngredient,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddRotationSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  logAddSetPosition,
  createAddIngredient,
  createAddMoonSalt,
  createAddSunSalt,
  createPourSolvent,
  createHeatVortex,
  createStirCauldron,
  createSetPosition,
  isVortex,
  stirIntoVortexV2,
  stirIntoVortex,
  stirToVortexEdge,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  stirToTier,
  stirToConsume,
  pourToVortexEdge,
  heatAndPourToEdge,
  pourToZoneV2,
  pourToZone,
  pourIntoVortex,
  derotateToAngle,
  pourUntilAngle,
  degToRad,
  radToDeg,
  degToSalt,
  radToSalt,
  saltToDeg,
  saltToRad,
  vecToDir,
  vecToDirCoord,
  dirToVec,
  relDir,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  getVortex,
  straighten,
  vMag,
  vAdd,
  vSub,
  vProd,
  vRot,
  vRot90,
  vNeg,
  unitV,
  unit,
  getCoord,
  getTotalMoon,
  getTotalSun,
  setVirtual,
  unsetVirtual,
  getRecipeItems,
  getPlot,
  setPreStir,
  setDisplay,
  setStirRounding,
  logError,
  printSalt,
} from "../mainScript";
import {
  SaltAngle,
  VortexRadiusLarge,
  VortexRadiusMedium,
  VortexRadiusSmall,
  DeviationT2,
  DeviationT3,
  DeviationT1,
  Entity,
  SaltType,
  Effects,
} from "../mainScript";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

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
  derotateToAngle(saltToDeg(SaltType.Sun, 26));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(degToRad(17.6), SaltType.Sun, { maxStir: 3 }); // Distance specified straightening.
  logAddStirCauldron(6.2);
  logAddSunSalt(52);
  logAddStirCauldron(0.7);
  logAddSunSalt(2);
  const p1 = getCoord();
  stirToTurn();
  const p2 = getCoord();
  let direction = vecToDir(vSub(p2, p1));
  console.log(direction);
  straighten(direction, SaltType.Sun, { maxGrains: 371, ignoreReverse: false });
  straighten(direction, SaltType.Moon, { maxGrains: 8 });
  stirIntoVortex();
  console.log(getAngleEntity() + Math.PI);
  heatAndPourToEdge(0.1, 30);
  logAddHeatVortex(2.64);
  console.log(degToSalt(currentPlot.pendingPoints[0].angle));
  derotateToAngle(saltToDeg("moon", 207) - 11.99);
  straighten(degToRad(11), SaltType.Sun, { maxStir: 4, maxGrains: 206 });
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
