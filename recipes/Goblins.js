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
  getDeviation,
  setVirtual,
  unsetVirtual,
  getRecipeItems,
  getPlot,
  getPoint,
  getCoord,
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

/**
 * 3 GoblinMushrooms.
 * Theoretical and practical 420sun.
 */
function r_swiftness() {
  const total = 420;
  checkBase(BaseNames.Water);
  logAddSunSalt(total - 250);
  logAddIngredient(Ingredients.GoblinMushroom);
  logAddSunSalt(250);
  logAddIngredients(Ingredients.GoblinMushroom, [0, 1]);
  stirIntoVortex(7);
  logAddHeatVortex(3.0);
  logAddPourSolvent(1.2);
  logAddHeatVortex(1.2);
  logAddPourSolvent(1.2);
  logAddHeatVortex(5);
  logAddStirCauldron(1.1);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  stirToTarget(Effects.Water.Swiftness, { preStir: 10, maxStir: 0.5 });
}

/**
 * 3 GoblinMushrooms.
 * Theoretical and practical 31moon+501sun.
 */
function r_invisibility() {
  checkBase(BaseNames.Oil);
  logAddIngredient(Ingredients.GoblinMushroom, 0.78);
  logAddSunSalt(90);
  logAddIngredient(Ingredients.GoblinMushroom, 0.783);
  const pre = 128;
  logAddSunSalt(pre - getSun());
  logAddIngredient(Ingredients.GoblinMushroom);
  logAddSunSalt(480 - getSun());
  stirIntoVortex(7);
  logAddHeatVortex(4.8);
  stirIntoVortex(6);
  stirToConsume(3.53);
  logAddSunSalt(501 - getSun());
  const t = 31;
  derotateToAngle((124 + t) * 0.36, { toAngle: false });
  logAddHeatVortex(Infinity);
  const c = getCoord();
  const d = vecToDirCoord(-2.55 - c.x, 27.94 - c.y);
  console.log("d: " + radToDeg(d));
  console.log("~d: " + (radToDeg(getStirDirection()) - 90));
  setVirtual();
  const inst = stirToTurn({ directionBuffer: 70 * SaltAngle });
  console.log(inst);
  unsetVirtual();
  logAddStirCauldron(inst.distance - 0.001);
  const c2 = getCoord();
  console.log("~d:" + (radToDeg(getStirDirection()) + 90));
  console.log("~d:" + radToDeg(vecToDir(vSub(c2, c))));
  straighten(d, SaltNames.Moon, { preStir: 3, maxGrains: t });
}

/**
 * 2 GoblinMushrooms.
 * theroretical 742sun
 * practical 760sun
 */
function r_lightning() {
  checkBase(BaseNames.Oil);
  logAddIngredients(Ingredients.GoblinMushroom, [0.78, 1]);
  logAddSunSalt(430);
  stirIntoVortex(6);
  logAddHeatVortex(4.54);
  stirIntoVortex(4);
  // heatAndPourToEdge(1,5)
  logAddHeatVortex(2);
  logAddPourSolvent(0.04);
  logAddHeatVortex(5.5);
  stirToVortexEdge();
  logAddHeatVortex(2.5);
  const d = getHeatDirection() - Math.PI / 2;
  straighten(d, SaltNames.Sun, { preStir: 2, maxGrains: 312 });
  stirToTarget(Effects.Oil.Lightning);
}

function r_dexterity() {
  checkBase(BaseNames.Water);
  logAddSunSalt(430);
  logAddIngredients(Ingredients.GoblinMushroom, [0.86, 0.63]);
  derotateToAngle(12, { toAngle: false });
  logAddIngredients(Ingredients.GoblinMushroom, [0.7]);
  logAddIngredients(Ingredients.GoblinMushroom, [1]);
  derotateToAngle(0);
  stirIntoVortex(30);
  heatAndPourToEdge(1, 6);
  logAddHeatVortex(4.68);
  logAddStirCauldron(6.3);
  logAddPourSolvent(3.87);
  stirToDangerZoneExit();
  logAddPourSolvent(0.2);
  stirToDangerZoneExit();
  pourIntoVortex(16, 6);
  logAddHeatVortex(2.94);
  const d1 = getHeatDirection() + 1.5 * Math.PI;
  console.log("d1:" + radToDeg(d1));
  straighten(d1, SaltNames.Sun, { preStir: 2, maxGrains: 64 });
  stirToTarget(Effects.Water.Dexterity);
  console.log("~d1:" + radToDeg(getAngleEffect() + Math.PI));
}

/**
 * 4 GoblinMushrooms
 * Theoretical 102m+75s
 * practical 102m+77s
 */
function r_light() {
  checkBase(BaseNames.Water);
  logAddMoonSalt(102);
  logAddIngredients(Ingredients.GoblinMushroom, [0.739, 0.739, 0.58, 1]);
  logAddPourSolvent(Infinity);
  logAddStirCauldron(8.25);

  // console.log(getStirDirection())
  // console.log(getAngleOrigin())
  const d = getAngleOrigin();
  console.log("d: " + radToDeg(d));
  straighten(d, SaltNames.Sun, { maxGrains: 75 });
  setVirtual();
  const inst = stirToTurn({ preStir: 2, directionBuffer: 100 * SaltAngle });
  setVirtual();
  logAddStirCauldron(inst.distance - 0.001);
  console.log(radToDeg(getStirDirection()));

  setVirtual();
  const inst2 = stirToTurn({ preStir: 12, directionBuffer: 100 * SaltAngle });
  setVirtual();
  logAddStirCauldron(inst2.distance - 0.001);
  console.log(radToDeg(getStirDirection()));
  unsetVirtual();
  stirIntoVortex(17.5);
  logAddHeatVortex(1.23);
  logAddStirCauldron(3.86);
  logAddHeatVortex(6);
  logAddPourSolvent(2.78);
  derotateToAngle(11.99);
  logAddHeatVortex(4);
  stirToVortexEdge();
  for (let i = 0; i < 15; i++) {
    logAddHeatVortex(0.1);
    stirToVortexEdge();
  }
}

function r_mst3() {
  checkBase(BaseNames.Water);
  setVirtual();
  console.log(addIngredientByLength(11.28, { ingredientId: Ingredients.GoblinMushroom, shift: 1 }));
  unsetVirtual();
  logAddSunSalt(354);

  logAddIngredients(Ingredients.GoblinMushroom, [0.7686, 0.7686, 1, 0.552, 1]);
  logAddPourSolvent(Infinity);
  straighten(degToRad(18.2), SaltNames.Moon, { maxGrains: 155 });
  setVirtual();
  const inst = stirToTurn({ directionBuffer: 80 * SaltAngle });
  console.log(inst);
  setVirtual();
  logAddStirCauldron(inst.distance - 0.001);
  console.log(radToDeg(getStirDirection()) + 90);
  unsetVirtual();
  stirIntoVortex(22);
  console.log(radToDeg(getAngleEntity()) + 180);
  stirToConsume(3.1);
  heatAndPourToEdge(0.1, 23);
  logAddHeatVortex(3.24);
  derotateToAngle(-5);
  stirToTurn({ directionBuffer: 100 * SaltAngle });
  logAddPourSolvent(Infinity);
  stirToTarget(Effects.Water.Frost, { preStir: 20.5, maxStir: 0.5 });
}

function r_fireprotection() {
  checkBase(BaseNames.Oil);
  logAddSunSalt(334);
  logAddIngredients(Ingredients.GoblinMushroom, [0.834, 0.747]);
  derotateToAngle(32, { toAngle: false });
  logAddIngredients(Ingredients.GoblinMushroom, [0.761]);
  derotateToAngle(8.4, { toAngle: false });
  logAddIngredient(Ingredients.GoblinMushroom);
  logAddPourSolvent(Infinity);
  stirIntoVortex(3.7);
  stirToConsume(3.98);
  logAddHeatVortex(Infinity);
  const target = 11;
  stirToTurn({ preStir: 13 });
  const d = getStirDirection();
  straighten(d, SaltNames.Moon, { preStir: 0, maxGrains: target + 33 });
  straighten(d, SaltNames.Sun, { preStir: 3, maxGrains: target });
  logAddStirCauldron(Infinity);
}
