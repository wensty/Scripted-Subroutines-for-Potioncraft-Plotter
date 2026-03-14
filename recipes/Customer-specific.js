/**
 * Full import script.
 */

import {
  logAddIngredient,
  logAddIngredients,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddRotationSalt,
  // Wrapped operation instructions.
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  logAddSetPosition,
  logAddSetRotation,
  // Zone detections.
  isVortex,
  // Grinding subroutines.
  addIngredientByLength,
  // Stirring subroutines.
  stirIntoVortexV2,
  stirIntoVortex,
  stirToVortexEdgeV2,
  stirToVortexEdge,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  stirToTier,
  stirToConsume,
  // Pouring subroutines.
  pourToVortexEdge,
  heatAndPourToEdge,
  pourToZoneV2,
  pourToZone,
  pourIntoVortex,
  derotateToAngle,
  pourUntilAngle,
  // Conversions between angles, 2D vectors and directions.
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
  // Angle and direction extractions.
  getAngleOrigin,
  getAngleEntity,
  getAngleVortex,
  getAngleEffect,
  getStirDirection,
  getHeatDirection,
  getDerotateRate,
  getTangent,
  // Extraction of other informations.
  checkBase,
  getVortex,
  getDeviation,
  getPoint,
  getCoord,
  getAngle,
  // Complex subroutines.
  straighten,
  // vector utilities.
  intersectCircleG,
  vMag,
  vAdd,
  vSub,
  vProd,
  vRot,
  vRot90,
  vNeg,
  vRot270,
  unitV,
  unit,
  // getters and setters.
  getMoon,
  getSun,
  getStir,
  getRecipeStir,
  setVirtual,
  unsetVirtual,
  getRecipeItems,
  getPlot,
  setEps,
  setPourRoundBuffer,
  setAuxLineLength,
  setDisplay,
  setStirRounding,
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
  SaltNames,
  BaseNames,
  Effects,
} from "../mainScript";
import {
  createAddIngredient,
  createAddMoonSalt,
  createAddSunSalt,
  createPourSolvent,
  createHeatVortex,
  createStirCauldron,
  createSetPosition,
  createSetRotation,
} from "@potionous/instructions";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

// Effects:
// Dexterity:1, Swiftness:1, Rage:3
// Ingredients:
// PhantomSkirt:2
// Salts:
// Sun: 1002
function r1() {
  checkBase(BaseNames.Water);
  logSkirt(0.912);
  const derto = -148;
  const target = 0;
  straighten(degToRad(88.7), SaltNames.Sun, { preStir: 4.7, maxGrains: 269 });
  stirIntoVortex(11);
  logAddHeatVortex(5);
  console.log(getStir()); // 16.907
  logAddSunSalt(501 - getSun());
  pourToVortexEdge();
  heatAndPourToEdge(1, 6);
  logAddHeatVortex(5.54);
  // second skirt
  derotateToAngle(-120);
  logSkirt();
  derotateToAngle(-106.55);
  const c1 = getCoord();
  const d1 = radToDeg(getHeatDirection()) + 270;
  stirToTier(Effects.Water.Dexterity, { preStir: 1.6, deviation: DeviationT1, ignoreAngle: true });
  const c2 = getCoord();
  console.log("~: " + d1);
  console.log("~: " + radToDeg(vecToDir(vSub(c2, c1))));
  console.log(">136.3: " + radToDeg(getAngleEffect() + Math.PI));
  pourIntoVortex(16, 6);
  logAddHeatVortex(5);
  derotateToAngle(0);
  pourToVortexEdge();
  heatAndPourToEdge(1, 9);
  logAddPourSolvent(1.76);
  const d3 = getAngleOrigin() - Math.PI / 2;
  const c3 = getCoord();
  const d4 = vecToDirCoord(8.16 - c3.x, 16.25 - c3.y);
  console.log("d3: " + d3);
  console.log("~d3: " + d4);
  logAddSunSalt(348);
  stirIntoVortex(7);
  console.log("~d3:" + (getAngleEntity() - Math.PI));
  logAddSunSalt(153);
  derotateToAngle(derto);
  logAddHeatVortex(Infinity);
  // straighten(degToRad(-37),SaltNames.Sun,{preStir:5,maxGrains:target})
  stirIntoVortex(21);
  logAddHeatVortex(7);
  stirToTurn();
  stirToTurn();
  derotateToAngle(-15);
  logAddHeatVortex(Infinity);
  const center = 0.032;
  logAddPourSolvent(5.028 - center);
  stirToDangerZoneExit(4);
  logAddPourSolvent(1.14 + center);
  console.log(stirToTarget(Effects.Water.Rage, { preStir: 9.6 }).distance);
}
