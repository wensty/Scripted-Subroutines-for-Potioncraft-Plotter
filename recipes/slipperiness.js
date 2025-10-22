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
  isVortex,
  stirIntoVortex,
  stirToVortexEdge,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToNearestTarget,
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
  getDirectionByVector,
  getVectorByDirection,
  getRelativeDirection,
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  getCurrentVortexRadius,
  getTargetVortexInfo,
  straighten,
  getUnit,
  getTotalMoon,
  getTotalSun,
  setDisplay,
  setStirRounding,
  logError,
  logSalt,
} from "../main";
import {
  SaltAngle,
  VortexRadiusLarge,
  VortexRadiusMedium,
  VortexRadiusSmall,
  DeviationT2,
  DeviationT3,
  DeviationT1,
  Entity,
  Salt,
  Effects,
} from "../main";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Slipperiness",
    desc: "Slipperiness",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: {
      PhantomSkirt: 1,
    },
    Salts: {
      SunSalt: 548,
    },
    script: () => {
      checkBase("oil");
      logSkirt();
      logAddSunSalt(117);
      logAddStirCauldron(4.55);
      const a1 = getBottlePolarAngle(true);
      const a2 = getCurrentStirDirection();
      console.log(a1);
      console.log(a2);
      straighten(a1, Salt.Sun, { maxGrains: 336 });
      stirToTurn({ preStirLength: 9.5 });
      const a3 = getBottlePolarAngle();
      console.log(a3);
      straighten(a1, Salt.Sun, { maxGrains: 501 - getTotalSun() });
      const a4 = getCurrentStirDirection();
      console.log(a4);
      // console.log(saltToDeg("moon", 499 - (a1 - a4) / (Math.PI / 500)));
      pourUntilAngle(saltToDeg("moon", 499 - (a1 - a4) / (Math.PI / 500)));
      stirToTurn();
      pourToZoneV2({ exitZone: true, overPour: true });
      logAddPourSolvent(0.2); // pour some more distance.
      straighten(a1, Salt.Sun, { maxGrains: 47 });
      logAddStirCauldron(10.4);
      logAddHeatVortex(2.5);
    },
  },
};
