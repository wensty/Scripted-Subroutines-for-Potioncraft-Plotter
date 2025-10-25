import { pointDistance } from "@potionous/common";

import {
  addIngredient,
  addSunSalt,
  addMoonSalt,
  addHeatVortex,
  addStirCauldron,
  addPourSolvent,
  addSetPosition,
  createPourSolvent,
  createStirCauldron,
  createSetPosition,
} from "@potionous/instructions";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

const LuckyInfinity = 1437;
const SaltAngle = (2 * Math.PI) / 1000.0; // angle per salt in radian.
// Minimal pouring unit of current version of plotter. All pours are multiply of this.
// The inverse is used for float accuracy.
// const MinimalPour = 8e-3;
const MinimalPourInv = 125.0;
const VortexRadiusLarge = 2.39;
const VortexRadiusMedium = 1.99;
const VortexRadiusSmall = 1.74;
const EpsHigh = 2e-3; // precision for binary search of pouring length.
const EpsLow = 1e-5;
const DeviationT2 = 600.0;
const DeviationT3 = 100.0;
const DeviationT1 = 1.53 * 1800; // effect radius is 0.79, bottle radius is 0.74.
const Entity = {
  Vortex: ["Vortex"],
  PotionEffect: ["PotionEffect"],
  DangerZone: ["DangerZonePart", "StrongDangerZonePart", "WeakDangerZonePart"],
  StrongDangerZone: ["DangerZonePart", "StrongDangerZonePart"],
  HealZone: ["HealZonePart"],
  Swamp: ["SwampZonePart"],
};
const Salt = { Moon: "moon", Sun: "sun" };
let Display = true; // Macro to switch instruction display.
let RoundStirring = true; // macro to control whether round stirrings.
// Minimal stir unit of hand-added stirring instructions. Stirring instructions add by scripts can be infinitely precise, and inverse is used for float accuracy.
let StirUnitInv = 1000.0;
let Step = 1;
let TotalSun = 0;
let TotalMoon = 0;

const Effects = {
  Water: {
    Healing: { x: 5.3, y: -5.84, angle: 0 },
    Poison: { x: -5.65, y: -5.889, angle: 0 },
    Frost: { x: 11.54, y: -0.24, angle: 0 },
    Fire: { x: -14, y: 1.12, angle: 0 },
    Strength: { x: 0.74, y: -16.28, angle: 0 },
    WildGrowth: { x: 16.84, y: -11.97, angle: 0 },
    Mana: { x: 11.69, y: 11.69, angle: 0 },
    Explosion: { x: -13.08, y: 12.72, angle: 0 },
    Dexterity: { x: 20.86, y: 3.19, angle: 0 },
    Swiftness: { x: -0.89, y: 18.6, angle: 0 },
    StoneSkin: { x: -0.72, y: -23, angle: 0 },
    Sleep: { x: 21.85, y: -5.98, angle: 0 },
    PoisonProtection: { x: 23.62, y: -29.02, angle: 45 },
    Light: { x: -24.9, y: 0, angle: 0 },
    Lightning: { x: 10.37, y: 19.6, angle: 0 },
    Gluing: { x: 17.86, y: -59.08, angle: 90 },
    Stench: { x: -51.12, y: -48.1, angle: -135 },
    Slowness: { x: 8.41, y: -29.56, angle: 0 },
    Slipperiness: { x: 56.1, y: -7.75, angle: 90 },
    Fragrance: { x: 58.04, y: -23.72, angle: -135 },
    Acid: { x: -31.49, y: -18.27, angle: 0 },
    Charm: { x: -11.1, y: 27.12, angle: 0 },
    AcidProtection: { x: 33.39, y: 47.03, angle: 135 },
    FrostProtection: { x: -51.1, y: 0, angle: 45 },
    FireProtection: { x: 39.87, y: 0.52, angle: -45 },
    LightningProtection: { x: -5.28, y: -48.98, angle: 45 },
    Rage: { x: -20.34, y: 22.58, angle: 0 },
    Curse: { x: -60.56, y: -21.61, angle: -135 },
    MagicalVision: { x: 21.27, y: 10.44, angle: 0 },
    Rejuvenation: { x: 38.96, y: -55.19, angle: 180 },
    Fear: { x: -32.36, y: 52.87, angle: -150 },
    Libido: { x: -30.38, y: 14.2, angle: 0 },
    Invisibility: { x: 10.46, y: 35.57, angle: 0 },
    Enlargement: { x: -58.06, y: 12.09, angle: 135 },
    Hallucinations: { x: 35.55, y: 38.98, angle: 180 },
    Shrinking: { x: 59.66, y: 7.63, angle: -135 },
    Levitation: { x: -4.22, y: 36.37, angle: 0 },
    Inspiration: { x: 7.64, y: 61.12, angle: 105 },
    AntiMagic: { x: 47.59, y: 48.6, angle: 180 },
    Luck: { x: 59.77, y: 31.3, angle: 135 },
    Necromancy: { x: -27.41, y: 30.4, angle: 0 },
  },
  Oil: {
    Healing: { x: 3.8, y: -3.96, angle: 15 },
    Poison: { x: -3.85, y: -3.74, angle: -15 },
    Fire: { x: -11.65, y: -0.98, angle: 60 },
    WildGrowth: { x: 17.25, y: -12.41, angle: 90 },
    Explosion: { x: -8.96, y: 9.3, angle: 90 },
    StoneSkin: { x: 0, y: -14.19, angle: 180 },
    PoisonProtection: { x: 16.22, y: -20.38, angle: 0 },
    Light: { x: -20.89, y: 1.48, angle: 135 },
    Lightning: { x: 7.84, y: 16.46, angle: -90 },
    Gluing: { x: -3.95, y: -23.57, angle: 0 },
    Stench: { x: -16.83, y: -19.91, angle: 0 },
    Slipperiness: { x: 24.7, y: -4.11, angle: 0 },
    AcidProtection: { x: 23.57, y: -30.32, angle: 0 },
    FrostProtection: { x: -27.97, y: -4.09, angle: 0 },
    FireProtection: { x: 28.91, y: 1.7, angle: 0 },
    LightningProtection: { x: 3.66, y: -30.72, angle: 0 },
    Rejuvenation: { x: 37.18, y: -32.56, angle: 0 },
    Invisibility: { x: -2.55, y: 27.94, angle: -135 },
    Enlargement: { x: -43.1, y: 3.73, angle: 0 },
    Shrinking: { x: 44.43, y: -3.63, angle: 0 },
    AntiMagic: { x: 32.77, y: 29.94, angle: 0 },
  },
  Wine: {
    Healing: { x: 3, y: -3, angle: -25 },
    Frost: { x: 7.87, y: 0.34, angle: -70 },
    Strength: { x: 0.66, y: -9, angle: 60 },
    Mana: { x: 7.38, y: 6.79, angle: 45 },
    Dexterity: { x: 14.21, y: 3.53, angle: 30 },
    Swiftness: { x: 1, y: 9, angle: -45 },
    Sleep: { x: 15.65, y: -2.25, angle: -60 },
    Slowness: { x: 0.48, y: -16, angle: 50 },
    Fragrance: { x: 22.82, y: -7.41, angle: 0 },
    Acid: { x: -13.14, y: -9.02, angle: -115 },
    Charm: { x: -6.25, y: 11.79, angle: 120 },
    Rage: { x: -13.04, y: 10.59, angle: -40 },
    Curse: { x: -21.93, y: -9.02, angle: 0 },
    MagicalVision: { x: 18.63, y: 9.79, angle: 90 },
    Fear: { x: -19.45, y: 14.64, angle: 0 },
    Libido: { x: -17.67, y: 3.61, angle: -20 },
    Hallucinations: { x: 19.25, y: 16.3, angle: 0 },
    Levitation: { x: -1.12, y: 18.65, angle: -150 },
    Inspiration: { x: 2.52, y: 25.77, angle: 0 },
    Luck: { x: 26.56, y: 10.66, angle: 0 },
    Necromancy: { x: -12.28, y: -17.33, angle: 180 },
  },
};

/**
 * Utility functions.
 */

/**
 * Fixes undefined coordinates in a PotionBaseEntity object by setting them to 0.0.
 *
 * @param {import("@potionous/dataset").PotionBaseEntity | undefined} entity - The entity to fix.
 * @returns {{x: number, y: number} | undefined} The entity with defined coordinates or undefined if the input is undefined.
 */
function fixUndef(entity) {
  if (entity === undefined) return undefined;
  return { x: entity.x || 0.0, y: entity.y || 0.0 };
}

/**
 * Extracts the x and y coordinates from a given plot point, defaulting to the current point.
 * @param {import("@potionous/plot").PlotPoint} [point=currentPlot.pendingPoints[0]] - The plot point to extract coordinates from.
 * @returns {{x: number, y: number}} The extracted coordinates with defaults applied.
 */
function extractCoordinate(point = currentPlot.pendingPoints[0]) {
  const { x, y } = point;
  return { x: x || 0.0, y: y || 0.0 };
}

/**
 * Logs an error message with the operation and additional information.
 * Terminates the script by attempting to reassign a constant.
 * @param {string} operation - The operation that caused the error.
 * @param {string} info - Additional information about the error.
 */
function logError(operation, info) {
  console.log("Error while " + operation + ": " + info);
  const terminator = 0;
  // eslint-disable-next-line no-const-assign
  terminator = 1;
  throw Error(); // plotter do not catch this inside if statements. Inform linter script should end here.
}

/**
 * Sets the display flag to control instruction display.
 * @param {boolean} display - A boolean value to enable or disable instruction display.
 */
function setDisplay(display) {
  Display = display;
}

/**
 * Logs a step message with the current step number and additional information.
 * The logging is controlled by the `Display` flag.
 * @param {string} stepInfo - Additional information about the step.
 */
function displayStep(stepInfo) {
  if (Display) {
    console.log("Step " + Step + ": " + stepInfo);
  }
}

/**
 * Sets the stir rounding flag to control whether rounding the stir length.
 * @param {boolean} roundStirring - A boolean value to enable or disable rounding the stir length.
 */
function setStirRounding(roundStirring) {
  RoundStirring = roundStirring;
}

/** Vector operations. */
/** @type {(v: {x: number, y: number}) => number} */
const vMag = (v) => Math.sqrt(v.x ** 2 + v.y ** 2);
/** @type {(v1: {x: number, y: number}, v2: {x: number, y: number}) => {x: number, y: number}} */
const vAdd = (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y });
/** @type {(v1: {x: number, y: number}, v2: {x: number, y: number}) => {x: number, y: number}} */
const vSub = (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y });
/** @type {(v1: {x: number, y: number}, v2: {x: number, y: number}) => number} */
const vProd = (v1, v2) => v1.x * v2.x + v1.y * v2.y;
/** @type {(v: {x: number, y: number}, angle: number) => {x: number, y: number}} */
const vRot = (v, angle) => ({
  x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
  y: v.x * Math.sin(angle) + v.y * Math.cos(angle),
});
/** @type {(v: {x: number, y: number}) => {x: number, y: number}} */
const vRot90 = (v) => ({ x: -v.y, y: v.x });
/** @type {(v: {x: number, y: number}) => {x: number, y: number}} */
const vNeg = (v) => ({ x: -v.x, y: -v.y });
/** @type {(v: {x: number, y: number}) => {x: number, y: number}} */
const vRot270 = (v) => ({ x: v.y, y: -v.x });

/**
 * Calculates the intersection points of a line defined by a point and direction, and a circle.
 * @param {{x: number, y: number, r: number}} circle - The circle to intersect with.
 * @param {{x: number, y: number}} point - The point on the line.
 * @param {{x: number, y: number}} direction - The direction of the line.
 * @returns {{d1: number, d2: number} | undefined} An object with the left and right intersection points, or undefined if no intersection is found.
 */
function intersectCircle(circle, point, direction) {
  const { r } = circle;
  const a = vMag(direction) ** 2;
  const b = 2 * vProd(direction, vSub(point, circle));
  const c = vMag(vSub(point, circle)) ** 2 - r ** 2;
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant < 0) return undefined;
  const d1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const d2 = (-b + Math.sqrt(discriminant)) / (2 * a);
  return { d1, d2 };
}

/**
 * Checks if the currentpotion base is the given expected base.
 * @param {"water"|"oil"|"wine"} expectedBase The expected base name.
 */
function checkBase(expectedBase) {
  if (!["water", "oil", "wine"].includes(expectedBase)) {
    logError("checkBase", "Unknown expected base: " + expectedBase + ".");
  } else {
    const currentBase = PotionBases.current.id;
    if (currentBase != expectedBase) {
      logError("checkBase", "" + currentBase + " is not the expected base " + expectedBase + ".");
      return;
    }
  }
}

function logSalt() {
  console.log("Total moon salt: " + TotalMoon + ", Total sun salt: " + TotalSun);
}

/**
 * Logging function to display the current step and the action taken.
 */

/**
 * Logs the addition of an ingredient and adds it to the current plot.
 * @param {import("@potionous/dataset").IngredientId} ingredientId The ID of the ingredient to add.
 * @param {number} [grindPercent=1.0] The percentage of the ingredient to grind, default to be 1.0.
 * @param {boolean} [display=Display] Whether to display the step message, default to the value of Display.
 */
function logAddIngredient(ingredientId, grindPercent = 1.0) {
  displayStep("Adding " + grindPercent * 100 + "% of " + ingredientId);
  Step += 1;
  addIngredient(ingredientId, grindPercent);
}
const logSkirt = (grindPercent = 1.0) => logAddIngredient(Ingredients.PhantomSkirt, grindPercent);

/**
 * Logs the addition of sun salt and adds it to the current plot.
 * @param {number} grains The amount of sun salt to add in grains.
 */
function logAddSunSalt(grains) {
  if (grains <= 0) return;
  displayStep("Adding " + grains + " grains of sun salt");
  Step += 1;
  TotalSun += grains;
  addSunSalt(grains);
}

/**
 * Logs the addition of moon salt and adds it to the current plot.
 * @param {number} grains The amount of moon salt to add in grains.
 */
function logAddMoonSalt(grains) {
  if (grains <= 0) return;
  displayStep("Adding " + grains + " grains of moon salt");
  Step += 1;
  TotalMoon += grains;
  addMoonSalt(grains);
}

/**
 * Logs the addition of rotation salt and adds it to the current plot.
 * @param {"moon"|"sun"} salt The type of rotation salt to add ("sun" or "moon").
 * @param {number} grains The amount of salt to add in grains.
 */
function logAddRotationSalt(salt, grains) {
  if (salt == "moon") {
    logAddMoonSalt(grains);
    return;
  }
  if (salt == "sun") {
    logAddSunSalt(grains);
    return;
  }
  logError("adding rotation salt", "salt must be moon or sun.");
}

/**
 * Logs the addition of heat to a vortex and adds it to the current plot.
 * @param {number} length The amount of heat to add to the vortex in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddHeatVortex(length) {
  if (length <= 0) return;
  displayStep("Heat the vortex by " + length + " distance.");
  Step += 1;
  addHeatVortex(Math.min(length, LuckyInfinity));
}

/**
 * Logs the addition of a stir cauldron instruction and adds it to the current plot.
 * @param {number} length The amount of stirring to add in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddStirCauldron(length) {
  if (length <= 0) return;
  displayStep("Stir the cauldron by " + length + " distance.");
  Step += 1;
  addStirCauldron(Math.min(length, LuckyInfinity));
  return;
}
/**
 * Logs the addition of a pour solvent instruction and adds it to the current plot.
 * @param {number} length The amount of solvent to pour in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddPourSolvent(length) {
  if (length <= 0) return;
  displayStep("Pour solvent by " + length + " distance.");
  Step += 1;
  addPourSolvent(Math.min(length, LuckyInfinity));
}

/**
 * Logs the addition of a set position instruction and adds it to the current plot.
 * @param {number} x The x coordinate to set
 * @param {number} y The y coordinate to set
 */
function logAddSetPosition(x, y) {
  displayStep("Teleporting to (" + x + ", " + y + ")");
  Step += 1;
  addSetPosition(x, y);
}

/**
 * Detection functions for different entity types.
 */

/**
 * Returns a function that checks if the bottle collides to one of the expected entity types.
 * @param {string[]} expectedEntityTypes The expected entity types.
 * @returns {(x: import("@potionous/dataset").PotionBaseEntity) => boolean} A function that takes an entity and returns if it is one of the given type.
 */
const isEntityType = (expectedEntityTypes) => (x) => expectedEntityTypes.includes(x.entityType);
const isVortex = isEntityType(Entity.Vortex);

/**
 * Subroutines related to stirring.
 */

/**
 * Stirs the solution into next vortex.
 * @param {number} [preStir=0.0] The stir length before stirring into vortex.
 * @param {number} [buffer=1e-5] The buffer to adjust the final stir length.
 */
function stirIntoVortex(preStir = 0.0, buffer = 1e-5) {
  let pendingPoints = currentPlot.pendingPoints;
  if (preStir > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat(createStirCauldron(preStir))
    ).pendingPoints;
  }
  const currentVortex = fixUndef(pendingPoints[0].bottleCollisions.find(isVortex));
  let currentStirLength = 0.0;
  let index = 0;
  let current = extractCoordinate(pendingPoints[0]);
  while (true) {
    index += 1;
    if (index == pendingPoints.length) {
      logError("stirring into vortex", "no vortex found.");
      return;
    }
    const vortex = fixUndef(pendingPoints[index].bottleCollisions.find(isVortex));
    if (
      vortex != undefined &&
      (currentVortex == undefined || vortex.x != currentVortex.x || vortex.y != currentVortex.y)
    ) {
      const next = extractCoordinate(pendingPoints[index]);
      let stir =
        preStir +
        currentStirLength +
        intersectCircle(getTargetVortexPoint(vortex), current, unitV(vSub(next, current))).d1;
      if (RoundStirring) {
        logAddStirCauldron(Math.ceil(stir * StirUnitInv) / StirUnitInv);
        return;
      }
      logAddStirCauldron(stir + buffer);
      return;
    }
    currentStirLength += pointDistance(pendingPoints[index - 1], pendingPoints[index]);
    current = extractCoordinate(pendingPoints[index]);
  }
}

/**
 * Stirs the potion to the edge of the current vortex.
 * @param {number} [preStir=0.0] The stir length before stirring.
 * @param {number} [buffer=1e-5] The buffer to adjust the final stir length.
 */
function stirToVortexEdge(preStir = 0.0, buffer = 1e-5) {
  let plot = currentPlot;
  if (preStir > 0.0) {
    plot = computePlot(currentRecipeItems.concat([createStirCauldron(preStir)]));
  }
  const pendingPoints = plot.pendingPoints;
  // const vortex = fixUndef(pendingPoints[0].bottleCollisions.find(isVortex));
  const vortex = getTargetVortexPoint(pendingPoints[0]);
  let stirLength = 0.0;
  if (vortex === undefined) {
    logError("stirring to edge", "bottle not in a vortex.");
    return;
  }
  let index = 0;
  while (true) {
    index += 1;
    const result = fixUndef(pendingPoints[index].bottleCollisions.find(isVortex));
    if (result === undefined || result.x != vortex.x || result.y != vortex.y) {
      break;
    } else {
      if (index == pendingPoints.length) {
        logError("stirring to edge of vortex", "Can not reach the edge of the vortex.");
        return;
      }
      stirLength += pointDistance(pendingPoints[index - 1], pendingPoints[index]);
    }
  }
  const current = extractCoordinate(pendingPoints[index - 1]);
  const next = extractCoordinate(pendingPoints[index]);
  const iC = intersectCircle(vortex, current, unit(next.x - current.x, next.y - current.y));
  const stir = preStir + stirLength + iC.d2;
  if (RoundStirring) {
    logAddStirCauldron(Math.floor(stir * StirUnitInv) / StirUnitInv);
    return;
  }
  logAddStirCauldron(stir - buffer);
  return;
}

/**
 * Stirs the potion until a change in direction is detected or the maximum
 * additional stir length is reached.
 *
 * @param {object} [options] - Options for the stirring process.
 * @param {number} [options.preStirLength=0.0] - The minimum initial stir length.
 * @param {number} [options.maxStirLength=Infinity] - The maximum additional stir length
 *     allowed beyond the initial length before stopping.
 * @param {number} [options.directionBuffer=20 * SaltAngle] - The buffer angle used to
 *     determine the change in direction.
 * @param {number} [options.segmentLength=1e-9] - The minimal length of each
 *     segment of the potion path.
 */
function stirToTurn(options = {}) {
  const {
    preStirLength = 0.0,
    maxStirLength = Infinity,
    directionBuffer = 20 * SaltAngle,
    segmentLength = 1e-9,
  } = options;

  const minCosine = Math.cos(directionBuffer);
  let pendingPoints = currentPlot.pendingPoints;
  if (preStirLength > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat([createStirCauldron(preStirLength)])
    ).pendingPoints;
  }
  let currentUnit = undefined;
  let i = 0;
  let j;
  let stirLength = 0.0;
  let nextSegmentLength = 0.0;
  while (true) {
    j = i;
    while (true) {
      j += 1;
      if (j >= pendingPoints.length) {
        logError("stirring to turn", "no turning point found.");
        return;
      } // Did not find a node that is not the current point.
      nextSegmentLength += pointDistance(pendingPoints[j - 1], pendingPoints[j]);
      if (nextSegmentLength > segmentLength) {
        break;
      }
    }
    const nextUnit = unitV(vSub(pendingPoints[j], pendingPoints[i]));
    if (currentUnit != undefined && vProd(currentUnit, nextUnit) < minCosine) {
      if (RoundStirring) {
        logAddStirCauldron(Math.ceil((preStirLength + stirLength) * StirUnitInv) / StirUnitInv);
        return;
      }
      logAddStirCauldron(preStirLength + stirLength);
      return;
    } else {
      stirLength += nextSegmentLength;
      nextSegmentLength = 0.0;
      i = j;
      currentUnit = nextUnit;
      if (stirLength >= maxStirLength) {
        if (RoundStirring) {
          logAddStirCauldron(
            Math.ceil((preStirLength + maxStirLength) * StirUnitInv) * StirUnitInv
          );
        }
        logAddStirCauldron(preStirLength + maxStirLength);
        return;
      }
    }
  }
}

/**
 * Stirs the potion until it enters or exits a specified zone.
 * @param {object} [options] - Options for the stirring process.
 * @param {object} [options.zone=Entity.DangerZone] - The zone to be entered or exited.
 * @param {number} [options.preStir=0.0] - The minimum initial stir length.
 * @param {boolean} [options.overStir=false] - Whether to over stir by a small amount.
 * @param {boolean} [options.exitZone=false] - Whether to exit the zone instead of entering it.
 * @param {number} [options.buffer=1e-5] - The added buffer length  when not rounding the stir length.
 */
function stirToZone(options = {}) {
  const {
    zone = Entity.DangerZone,
    preStir = 0.0,
    overStir = false,
    exitZone = false,
    buffer = 1e-5,
  } = options;

  let plot = currentPlot;
  if (preStir > 0.0) {
    plot = computePlot(currentRecipeItems.concat([createStirCauldron(preStir)]));
  }
  const pendingPoints = plot.pendingPoints;
  let nextIndex = 0;
  let inZone = false;
  let stirDistance = preStir;
  while (true) {
    nextIndex += 1;
    if (nextIndex == pendingPoints.length) {
      logError("stir to zone", "no zone found.");
      return;
    }
    stirDistance += pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
    const result = pendingPoints[nextIndex].bottleCollisions.find(isEntityType(zone));
    if (result != undefined) {
      if (!exitZone) {
        break;
      }
      inZone = true;
    } else {
      if (inZone) {
        break;
      }
    }
  }
  if (RoundStirring) {
    logAddStirCauldron((Math.floor(stirDistance * StirUnitInv) + overStir) / StirUnitInv);
    return;
  }
  logAddStirCauldron(stirDistance + buffer * (2 * overStir - 1));
  return;
}

/**
 * Stirs the potion to the nearest point outside of the nearest danger zone. For compatibility.
 * @param {number} [preStirLength=0.0] - The minimum initial stir length.
 */
const stirToDangerZoneExit = (preStirLength) => {
  stirToZone({ zone: Entity.DangerZone, preStir: preStirLength, exitZone: true, overStir: true });
};

/**
 * Stirs the potion towards the nearest point to the given target coordinates.
 * This stir is not rounded for precision.
 * @param {object} target - The target effect.
 * @param {number} target.x - The x-coordinate of the target effect.
 * @param {number} target.y - The y-coordinate of the target effect.
 * @param {object} options - Options for the stirToNearestTarget function.
 * @param {number} [options.preStir=0.0] - The initial stir length before
 *   the optimization.
 * @param {number} [options.maxStir=Infinity] - The maximal stir length
 *   allowed in the optimization.
 * @param {number} [options.segmentLength=1e-9] - The minimal length of
 *   each segment in the optimization process.
 * @returns {number} The optimal distance to the target after stirring.
 */
function stirToTarget(target, options = {}) {
  const { preStir = 0.0, maxStir = Infinity, segmentLength = 1e-9 } = options;
  let pendingPoints = currentPlot.pendingPoints;
  if (preStir > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat([createStirCauldron(preStir)])
    ).pendingPoints;
  }
  const initial = extractCoordinate(pendingPoints[0]);
  const initialDistance = vMag(vSub(initial, target));
  let isLastSegment = false;
  let currentStirLength = 0.0;
  let optimalStir = 0.0;
  let optimalDistance = initialDistance;
  let i = 0;
  let j = i;
  let nextSegmentLength = 0.0;
  let current = initial;
  while (!isLastSegment) {
    while (true) {
      j += 1;
      if (j == pendingPoints.length) {
        isLastSegment = true;
        break;
      }
      nextSegmentLength += pointDistance(pendingPoints[j - 1], pendingPoints[j]);
      if (nextSegmentLength > segmentLength) {
        break;
      }
    }
    if (nextSegmentLength <= segmentLength) {
      continue; // Last segment too short.
    }
    if (currentStirLength + nextSegmentLength > maxStir) {
      isLastSegment = true;
    }
    const next = extractCoordinate(pendingPoints[j]);
    const nextUnit = unitV(vSub(next, current));
    const lastStir = vProd(nextUnit, vSub(target, current));
    if (lastStir > nextSegmentLength) {
      const nextDistance = vMag(vSub(target, next));
      if (nextDistance < optimalDistance) {
        optimalStir = currentStirLength + nextSegmentLength;
        optimalDistance = nextDistance;
      }
    } else {
      if (lastStir >= 0) {
        const lastOptimalDistance = Math.abs(vProd(vRot90(nextUnit), vSub(target, current)));
        if (lastOptimalDistance < optimalDistance) {
          optimalDistance = lastOptimalDistance;
          optimalStir = currentStirLength + lastStir;
        }
      }
    }
    i = j;
    current = extractCoordinate(pendingPoints[i]);
    currentStirLength += nextSegmentLength;
    nextSegmentLength = 0.0;
  }
  logAddStirCauldron(preStir + optimalStir);
  return optimalDistance;
}

/**
 * Stirs the potion to the specified tier of a certain effect
 * This stir is not rounded for precision reason.
 * @param {object} target - The target effect.
 * @param {number} target.x - The x-coordinate of the target effect.
 * @param {number} target.y - The y-coordinate of the target effect.
 * @param {number} target.angle - The angle of the target effect in degrees.
 * @param {object} options - Options for the stirring process.
 * @param {number} [options.preStir=0.0] - The minimal stir length
 *     to ensure the stir is not too short.
 * @param {number} [options.deviation=DeviationT2] - The maximal allowable
 *     deviation from the target effect's angle.
 * @param {boolean} [options.ignoreAngle=false] - Whether to ignore the
 *     angle deviation in the stirring process.
 * @param {number} [options.segmentLength=1e-9] - The minimal length
 *     of each segment in the stirring path.
 * @param {number} [options.buffer=1e-5] - The buffer added after
 *     stirring to ensure precision.
 */
function stirToTier(target, options = {}) {
  const {
    preStir = 0.0,
    deviation = DeviationT2,
    ignoreAngle = false,
    segmentLength = 1e-9,
    buffer = 1e-5,
  } = options;
  let pendingPoints = currentPlot.pendingPoints;
  if (preStir > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat(createStirCauldron(preStir))
    ).pendingPoints;
  }
  let currentPoint = pendingPoints[0];
  let angleDeviation = 0.0;
  if (!ignoreAngle) {
    const currentAngle = -currentPoint.angle || 0.0;
    const angleDelta = radToDeg(Math.abs(relDir(degToRad(currentAngle), degToRad(target.angle))));
    angleDeviation = angleDelta * (100.0 / 12.0);
    if (angleDeviation >= deviation) {
      logError("stir to tier", "too much angle deviation.");
      return;
    }
  }
  const tierRadius = (deviation - angleDeviation) / 1800.0;
  let i = 0;
  let j;
  let stir = 0.0;
  while (true) {
    for (j = i; j < pendingPoints.length; j++) {
      if (pointDistance(pendingPoints[i], pendingPoints[j]) > segmentLength) {
        break;
      }
    }
    if (j == pendingPoints.length) {
      logError("stirring to tier", "cannot reach target tier.");
      return;
    }
    const nextPoint = pendingPoints[j];
    const iC = intersectCircle(
      { x: target.x, y: target.y, r: tierRadius },
      currentPoint,
      unitV(vSub(nextPoint, currentPoint))
    );
    if (iC != undefined && iC.d1 >= 0.0 && iC.d1 < pointDistance(currentPoint, nextPoint)) {
      stir += iC.d1 + preStir;
      if (RoundStirring) {
        logAddStirCauldron(Math.ceil(stir * MinimalPourInv) / MinimalPourInv);
        return;
      }
      logAddStirCauldron(stir + buffer);
      return;
    }
    stir += pointDistance(currentPoint, nextPoint);
    i = j;
    currentPoint = nextPoint;
  }
}
/**
 * Stirs the potion to consume a specified length while in a vortex.
 * This is not affected by stir rounding, since the stir length is manually input.
 * @param {number} length - The length of stirring to consume.
 */
function stirToConsume(length) {
  const currentPoint = currentPlot.pendingPoints[0];
  const result = currentPoint.bottleCollisions.find(isVortex);
  if (result == undefined) {
    logError("stirring to consume", "bottle not in a vortex.");
    return;
  }
  logAddStirCauldron(length);
  logAddSetPosition(currentPoint.x, currentPoint.y);
  return;
}

// Subroutines related to pouring solvent.

/**
 * Pours solvent to the edge of the current vortex.
 */
function pourToVortexEdge() {
  const currentPoint = currentPlot.pendingPoints[0];
  const vortex = getTargetVortexPoint(currentPoint);
  if (vortex === undefined) {
    logError("pouring to edge", "bottle not in a vortex.");
    return;
  }
  const current = extractCoordinate(currentPoint);
  const pour = intersectCircle(vortex, current, unitV(vNeg(current))).d2;
  logAddPourSolvent((Math.floor(pour * MinimalPourInv) - 0.5) / MinimalPourInv);
  return;
}

/**
 * Pours solvent into the target vortex.
 *
 * @param {number} x - The x-coordinate of the target vortex.
 * @param {number} y - The y-coordinate of the target vortex.
 */
function pourIntoVortex(x, y) {
  const current = extractCoordinate();
  const vortex = getTargetVortex(x, y);
  const iC = intersectCircle(vortex, current, unitV(vSub(vortex, current)));
  if (iC === undefined || iC.d2 < 0.0) {
    logError(
      "pouring into target vortex",
      "bottle polar angle deviates too much or not behind the target vortex."
    );
    return;
  }
  const pour = iC.d1;
  logAddPourSolvent((Math.ceil(pour * MinimalPourInv) - 0.5) / MinimalPourInv);
  return;
}

/**
 * Heats and pours to the edge of the current vortex.
 * @param {number} maxHeat - The maximum length to heat.
 * @param {number} repeats - The number of times to repeat the heating and pouring process.
 */
function heatAndPourToEdge(maxHeat, repeats) {
  const vortexCenter = fixUndef(currentPlot.pendingPoints[0].bottleCollisions.find(isVortex));
  if (vortexCenter === undefined) {
    logError("pouring to edge", "bottle not in a vortex.");
    return;
  }
  const vortexRadius = getTargetVortexPoint(vortexCenter).r;
  const c = 0.17; // the coefficient of the archimedean spiral formed by the vortex.
  const vortexDistance = vMag(vortexCenter);
  const alpha = Math.acos(vortexRadius / vortexDistance);
  const edgeLimit = unitV(vRot(vNeg(vortexCenter), -alpha));
  for (let i = 0; i < repeats; i++) {
    const point = extractCoordinate();
    let maxLength = Infinity;
    if (vProd(edgeLimit, vSub(point, vortexCenter)) > 0) {
      maxLength = vProd(vRot90(edgeLimit), vSub(point, vortexCenter)) - c;
      if (maxLength < 0) {
        break;
      }
      /**
       * buffer.
       * online plotter do not support *= operand.
       */
      maxLength = maxLength * 0.75;
      maxLength = (Math.floor(maxLength * MinimalPourInv) - 0.5) / MinimalPourInv;
    }
    logAddHeatVortex(Math.min(maxHeat, maxLength));
    pourToVortexEdge();
  }
  return;
}

/**
 * Pours solvent to move the bottle towards or out of an assigned zone.
 * @param {object} [options] - Options for the pouring process.
 * @param {string[]} [options.zone=Entity.DangerZone] - The zone to pour towards or out of.
 * @param {number} [options.prePour=0.0] - The initial length of pouring.
 * @param {number} [options.maxPour=Infinity] - The maximum length of pouring.
 * @param {boolean} [options.overPour=false] - Whether to pour slightly more than the minimum required.
 * @param {boolean} [options.exitZone=false] - Whether to exit the zone instead of entering it.
 */
function pourToZoneV2(options = {}) {
  const {
    zone = Entity.DangerZone,
    prePour = 0.0,
    maxPour = Infinity,
    overPour = false,
    exitZone = false,
  } = options;
  logAddPourSolvent(prePour);
  const detector = isEntityType(zone);
  const { x, y } = extractCoordinate();
  const plot = computePlot([createSetPosition(x, y), createPourSolvent(maxPour)]);
  let inZone = false;
  let nextIndex = 0;
  let pourLength = 0.0;
  function addPour() {
    pourLength = Math.max(
      (Math.floor(pourLength * MinimalPourInv) - 0.5 + overPour) / MinimalPourInv,
      0.0
    );
    logAddPourSolvent(pourLength);
  }
  while (true) {
    let entity = plot.committedPoints[nextIndex].bottleCollisions.find(detector);
    if (entity != undefined) {
      if (!exitZone) {
        addPour();
        return;
      }
      inZone = true;
    }
    if (entity == undefined && inZone) {
      addPour();
      return;
    }
    pourLength = pointDistance(plot.committedPoints[0], plot.committedPoints[nextIndex]);
    nextIndex += 1;
    if (nextIndex == plot.committedPoints.length) {
      logError("pouring to zone", "cannot reach (or out of) zone.");
      return;
    }
  }
}

// for old recipe compatibility.
const pourToZone = (maxPour, zone = Entity.DangerZone) =>
  pourToZoneV2({ maxPour: maxPour, zone: zone });

/**
 * Derotates the bottle to the target angle.
 * @param {number} targetAngle - The target angle in degrees.
 * @param {Object} [options] - Optional parameters for derotating.
 * @param {boolean} [options.toAngle=true] - Whether to derotate to the target angle or by the target angle.
 */
function derotateToAngle(targetAngle, options = {}) {
  const initialPoint = currentPlot.pendingPoints[0];
  const { toAngle = true } = options;
  const { x, y } = extractCoordinate();
  var _targetAngle = targetAngle;
  const currentAngle = -initialPoint.angle;
  if (toAngle) {
    if (targetAngle * (targetAngle - currentAngle) > 0) {
      logError("derotating", "Cannot derotate to larger or reversed angle.");
    }
  } else {
    _targetAngle = currentAngle - (2 * (currentAngle > 0) - 1) * targetAngle;
  }
  if (x != 0.0 || y != 0.0) {
    const result = initialPoint.bottleCollisions.find(isVortex);
    if (result == undefined) {
      logError("derotating", "Cannot derotate outside vortex.");
      return;
    }
    logAddSetPosition(0, 0);
  }
  pourUntilAngle(_targetAngle);
  logAddSetPosition(x, y);
}

/**
 * Pours solvent until the bottle reaches the target angle.
 * @param {number} targetAngle - The target angle in degrees to rotate the bottle to.
 * @param {Object} [options] - Optional parameters for the pouring process.
 * @param {number} [options.minPour=0.0] - The optional minimum pour length.
 * @param {number} [options.maxPour=Infinity] - The optional maximum pour length.
 * @param {number} [options.epsHigh=EpsHigh] - The precision for high range binary search.
 * @param {number} [options.epsLow=EpsLow] - The precision for low range binary search.
 * @param {number} [options.buffer=0.012] - Buffer value for adjusting the binary search range.
 * @param {boolean} [options.overPour=true] - Decides whether to slightly over pour.
 */
function pourUntilAngle(targetAngle, options = {}) {
  if (targetAngle == 0.0) {
    logAddPourSolvent(Infinity);
    return;
  }
  const { x, y } = extractCoordinate();
  const currentAngle = -currentPlot.pendingPoints[0].angle;
  if (targetAngle * (targetAngle - currentAngle) <= 0) {
    const {
      minPour = 0.0,
      maxPour = Infinity,
      epsHigh = EpsHigh,
      epsLow = EpsLow,
      buffer = 0.012,
      overPour = true,
    } = options;
    const dist = Math.sqrt(x ** 2 + y ** 2);
    var _angleAtOrigin = 0.0;
    var toOrigin = false;
    _angleAtOrigin = -computePlot(currentRecipeItems.concat(createPourSolvent(dist)))
      .pendingPoints[0].angle; // the angle when the bottle pours exactly back to origin. Not necessarily zero.
    var l, r, e;
    if (targetAngle * (targetAngle - _angleAtOrigin) <= 0) {
      logAddPourSolvent(dist);
      l = Math.abs(targetAngle - _angleAtOrigin) / 9.0 - buffer;
      r = Math.abs(targetAngle - _angleAtOrigin) / 9.0 + buffer;
      e = epsHigh;
      toOrigin = true;
    } else {
      l = minPour;
      r = maxPour;
      e = epsLow;
      // assert range.
      if (r > dist) r = dist;
      if (l > r) l = r;
      if (l < 0) l = 0;
    }
    while (r - l > e) {
      const m = l + (r - l) / 2;
      const plot = computePlot(currentRecipeItems.concat(createPourSolvent(m)));
      const testAngle = -plot.pendingPoints[0].angle;
      if (targetAngle * (targetAngle - testAngle) <= 0) {
        l = m;
      } else {
        r = m;
      }
    }
    if (!toOrigin) {
      logAddPourSolvent((Math.floor(r * MinimalPourInv) - 0.5 + overPour) / MinimalPourInv); // type conversion.
    } else {
      logAddPourSolvent(l + (r - l) / 2);
    }
    return;
  }
}

/**
 * Utility for angle conversions and vector-direction conversions.
 */

/**
 * Converts degrees to radians.
 * @param {number} deg The degrees to convert
 * @returns {number} The radians equivalent of the given degrees
 */
const degToRad = (deg) => (deg * Math.PI) / 180.0;

/**
 * Converts radians to degrees.
 * @param {number} rad The radians to convert
 * @returns {number} The degrees equivalent of the given radians
 */
const radToDeg = (rad) => (rad * 180.0) / Math.PI;

/**
 * Converts degrees to salt.
 * @param {number} deg The degrees to convert
 * @returns {{salt: "moon"|"sun", grains: number}} The salt equivalent of the given degrees
 */
function degToSalt(deg) {
  const grains = (Math.abs(deg) * 500.0) / 180.0;
  if (deg > 0) {
    return { salt: "sun", grains: grains };
  }
  return { salt: "moon", grains: grains };
}

/**
 * Converts radians to salt.
 * @param {number} rad The radians to convert
 * @returns {{salt: "moon"|"sun", grains: number}} The salt equivalent of the given radians
 */
function radToSalt(rad) {
  const grains = (Math.abs(rad) * 500.0) / Math.PI;
  if (rad > 0) {
    return { salt: "sun", grains: grains };
  }
  return { salt: "moon", grains: grains };
}

/**
 * Converts salt to degree.
 * @param {"moon"|"sun"} salt The salt type ("moon" or "sun")
 * @param {number} grains The number of grains of salt
 * @returns {number} The degree equivalent of the given salt and grains
 */
function saltToDeg(salt, grains) {
  if (salt == "moon") {
    return (-grains * 180.0) / 500.0;
  } else if (salt == "sun") {
    return (grains * 180.0) / 500.0;
  } else {
    logError("converting salt to degree", "salt must be moon or sun.");
    return 0.0;
  }
}

/**
 * Converts salt to radian.
 * @param {"moon"|"sun"} salt The salt type ("moon" or "sun")
 * @param {number} grains The number of grains of salt
 * @returns {number} The radian equivalent of the given salt and grains
 */
function saltToRad(salt, grains) {
  if (salt == "moon") {
    return (-grains * Math.PI) / 500.0;
  } else if (salt == "sun") {
    return (grains * Math.PI) / 500.0;
  } else {
    logError("converting salt to radian", "salt must be moon or sun.");
    return 0.0;
  }
}

/**
 * Calculates the unit vector for the given 2D vector (x, y).
 * @param {{x: number, y: number}} v The 2D vector.
 * @returns {{x: number, y: number}} The unit vector with components x and y.
 */
function unitV(v) {
  const mag = vMag(v);
  if (mag < 1e-9) {
    logError("getting unit", "zero vector given.");
    return;
  }
  return { x: v.x / mag, y: v.y / mag };
}
/** @type {(x: number, y: number) => {x: number, y: number}} */
const unit = (x, y) => unitV({ x, y });

/**
 * Computes a 2D vector from a direction angle and an optional base direction angle.
 * @param {number} direction The direction angle in radians
 * @param {number} [baseDirection=0.0] The base direction angle in radians
 * @returns {{x: number, y: number}} The 2D vector with components x and y
 */
function dirToVec(direction, baseDirection = 0.0) {
  return { x: Math.sin(baseDirection + direction), y: Math.cos(baseDirection + direction) };
}

/**
 * Computes the relative direction between two direction angles.
 * The relative direction is always between -Math.PI and Math.PI.
 *
 * @param {number} direction The direction angle in radians
 * @param {number} baseDirection The base direction angle in radians
 * @returns {number} The relative direction between the two angles in radians
 */
function relDir(direction, baseDirection) {
  let relativeDirection = direction - baseDirection;
  relativeDirection -= 2 * Math.PI * Math.round(relativeDirection / (2 * Math.PI));
  return relativeDirection;
}

/**
 * Computes the direction angle of a 2D vector relative to a base direction.
 *
 * @param {{x: number, y: number}} v The 2D vector
 * @param {number} [baseDirection=0.0] The base direction angle in radians from which
 *   the vector's direction is calculated
 * @returns {number} The angle of the vector in radians, relative to the base direction
 */
function vecToDir(v, baseDirection = 0.0) {
  const unit = unitV(v);
  const rel = vRot(unit, baseDirection);
  let angle = Math.acos(rel.y);
  if (rel.x < 0) {
    angle = -angle;
  }
  return angle;
}
/** @type {(x: number, y: number, baseDirection?: number) => number} */
function vecToDirCoord(x, y, baseDirection = 0.0) {
  return vecToDir({ x, y }, baseDirection);
}

/**
 * Utilities to retrieve useful information.
 */

/**
 * Computes the direction angle of the current bottle position.
 * @param {boolean} [toBottle=true] - Calculates the direction to or from the bottle. Default to.
 * @returns {number} The direction angle in radians.
 */
function getBottlePolarAngle(toBottle = true) {
  let { x, y } = extractCoordinate();
  if (x == 0.0 && y == 0.0) {
    logError("getting bottle polar angle", "bottle at origin.");
    return 0.0;
  }
  if (!toBottle) {
    x = -x;
    y = -y;
  }
  return vecToDirCoord(x, y);
}

/**
 * Computes the direction angle of the current bottle position relative to the given entity.
 * @param {string[]} expectedEntityTypes A list of entity types to be considered. The function will return the direction to the first found entity.
 * @param {boolean} [toBottle=true] Calculates the direction to or from the bottle. Default to.
 * @returns {number} The direction angle in radians.
 */
function getBottlePolarAngleByEntity(expectedEntityTypes = Entity.Vortex, toBottle = true) {
  const currentPoint = currentPlot.pendingPoints[0];
  let entity = undefined;
  for (let i = 0; i < expectedEntityTypes.length; i++) {
    entity = fixUndef(
      currentPoint.bottleCollisions.find((x) => x.entityType === expectedEntityTypes[i])
    );
    if (entity !== undefined) break;
  }
  if (entity === undefined) {
    logError("getting bottle polar angle by entity", "given entity not found.");
    return 0.0;
  }
  let delta = { x: (currentPoint.x || 0.0) - entity.x, y: (currentPoint.y || 0.0) - entity.y };
  if (Math.abs(delta.x) < 1e-9 && Math.abs(delta.y) < 1e-9) {
    logError("getting bottle polar angle by entity", "bottle coincides the entity.");
    return 0.0;
  }
  if (!toBottle) {
    delta.x = -delta.x;
    delta.y = -delta.y;
  }
  return vecToDirCoord(delta.x, delta.y);
}

/**
 * Compute the current stir direction.
 * @param {number} [segmentLength=1e-9] - The minimal length of each segment of the potion path.
 * @returns {number} The direction angle in radians.
 */
function getCurrentStirDirection(segmentLength = 1e-9) {
  const pendingPoints = currentPlot.pendingPoints;
  /** the points have no coordinate at origin */
  const from = extractCoordinate();
  let i = 0;
  while (i < pendingPoints.length) {
    i += 1;
    if (pointDistance(pendingPoints[0], pendingPoints[i]) > segmentLength) {
      break;
    }
  }
  if (i == currentPlot.pendingPoints.length) {
    logError("getting current stir direction", "no next node.");
    return 0.0;
  } // Did not find a pendingPoints that is not the current point.
  const to = extractCoordinate(pendingPoints[i]);
  // return getDirectionByVectorStartEnd(from, to);
  return vecToDir(vSub(to, from));
}

/**
 * Retrieves the radius of the current vortex.
 * @returns {number} The radius of the current vortex.
 */
function getCurrentVortexRadius() {
  const currentPoint = currentPlot.pendingPoints[0];
  return getTargetVortex(currentPoint.x || 0.0, currentPoint.y || 0.0).r;
}

/**
 * Retrieves information about the target vortex at specified coordinates.
 * @param {number} x - The x-coordinate of the target vortex.
 * @param {number} y - The y-coordinate of the target vortex.
 * @returns {{x:number, y:number, r:number}} An object containing the x and y
 * coordinates and the radius of the target vortex.
 */
function getTargetVortex(x, y) {
  const result = fixUndef(
    computePlot([createSetPosition(x, y)]).pendingPoints[0].bottleCollisions.find(isVortex)
  );
  if (result == undefined) {
    logError("getting target vortex radius", "no vortex at target position.");
    return;
  }
  let small = computePlot([
    createSetPosition(result.x + 1.8, result.y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (small === undefined || small.x != result.x || small.y != result.y) {
    return { x: result.x, y: result.y, r: VortexRadiusSmall };
  }
  let medium = computePlot([
    createSetPosition(result.x + 2.2, result.y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (medium === undefined || medium.x != result.x || medium.y != result.y) {
    return { x: result.x, y: result.y, r: VortexRadiusMedium };
  }
  return { x: result.x, y: result.y, r: VortexRadiusLarge };
}

/**
 * Retrieves information about the target vortex at the specified coordinates.
 * @param {{x:number, y:number}} point - A point object with `x` and `y` properties.
 * @returns {{x:number, y:number, r:number}} An object containing the x and y
 * coordinates and the radius of the target vortex.
 */
const getTargetVortexPoint = (point) => getTargetVortex(point.x || 0.0, point.y || 0.0);

/**
 * Utilities to get the variable salt counter outside this file.
 */

/**
 * Returns the total amount of Sun Salt added so far.
 * @returns {number} The total amount of Sun Salt.
 */
function getTotalSun() {
  return TotalSun;
}

/**
 * Returns the total amount of Moon Salt added so far.
 * @returns {number} The total amount of Moon Salt.
 */
function getTotalMoon() {
  return TotalMoon;
}

/**
 * Complex subroutines: straighten the potion path.
 */

/**
 * Straighten the potion path.
 * @param {number} direction The direction to be stirred in radian.
 * @param {string} salt The type of salt to be added. It must be "moon" or "sun".
 * @param {Object} [options] Options for the straightening process.
 * @param {number} [options.maxStir=Infinity] The maximum distance to be stirred.
 * @param {number} [options.maxGrains=Infinity] The maximum amount of salt to be added.
 * @param {boolean} [options.ignoreReverse=true] If set to false, the function will terminate when a reversed direction is detected.
 * @param {number} [options.preStir=0.0] The amount of stirring to be added before the straightening process.
 * @param {number} [options.segmentLength=1e-9] The minimal length of each segment of the potion path.
 * @returns {number} The total amount of salt added.
 */
function straighten(direction, salt, options = {}) {
  if (salt != "moon" && salt != "sun") {
    logError("straightening", "salt must be moon or sun.");
    return 0;
  }
  const {
    maxStir = Infinity,
    maxGrains = Infinity,
    ignoreReverse = true,
    preStir = 0.0,
    segmentLength = 1e-9,
  } = options;
  const _maxStir = maxStir + preStir;
  let stirredLength = 0.0;
  let nextStirLength = 0.0;
  let nextSegmentLength = 0.0;
  let totalGrains = 0;
  let pendingPoints = computePlot(
    currentRecipeItems.concat([createStirCauldron(preStir)])
  ).pendingPoints;
  let lastSegment = false;
  let _preStirLength = preStir;
  let i = 0;
  while (!lastSegment) {
    const current = extractCoordinate(pendingPoints[i]);
    let j = i;
    while (true) {
      j += 1;
      if (j >= pendingPoints.length) {
        lastSegment = true;
        break;
      }
      nextSegmentLength += pointDistance(pendingPoints[j - 1], pendingPoints[j]);
      if (nextSegmentLength > segmentLength) {
        break;
      }
    }
    if (nextSegmentLength <= segmentLength) {
      continue;
    }
    const nextDirection = vecToDir(vSub(pendingPoints[j], current), direction);

    let grains;

    if (salt == "moon") {
      if (nextDirection < -SaltAngle / 2) {
        if (!ignoreReverse) {
          console.log("Detected reversed direction:" + nextDirection);
          break;
        }
        grains = 0;
      } else {
        grains = Math.round(nextDirection / SaltAngle);
      }
    } else {
      if (nextDirection > SaltAngle / 2) {
        if (!ignoreReverse) {
          console.log("Detected reversed direction:" + nextDirection);
          break;
        }
        grains = 0;
      } else {
        grains = Math.round(-nextDirection / SaltAngle);
      }
    }
    if (grains > 0) {
      if (nextStirLength > 0.0) {
        nextStirLength += _preStirLength;
        _preStirLength = 0.0;
        if (RoundStirring) {
          nextStirLength = Math.ceil(nextStirLength * StirUnitInv) / StirUnitInv;
        }
        logAddStirCauldron(nextStirLength);
        stirredLength += nextStirLength;
      }
      i = 0;
      nextSegmentLength = 0.0;
      nextStirLength = 0.0;
      if (totalGrains + grains >= maxGrains) {
        // capped grains
        grains = maxGrains - totalGrains;
        totalGrains += grains;
        logAddRotationSalt(salt, grains);
        console.log("Straignten terminated by maximal grains of salt added.");
        break;
      } else {
        totalGrains += grains;
        logAddStirCauldron(_preStirLength);
        _preStirLength = 0.0;
        logAddRotationSalt(salt, grains);
        // recalculate the new plotter after stir and salt.
        pendingPoints = currentPlot.pendingPoints;
      }
    } else {
      nextStirLength += nextSegmentLength;
      nextSegmentLength = 0.0;
      if (nextStirLength + stirredLength >= _maxStir) {
        // capped stir length.
        nextStirLength = _maxStir - stirredLength + _preStirLength;
        _preStirLength = 0.0;
        if (RoundStirring) {
          nextStirLength = Math.ceil(nextStirLength * StirUnitInv) / StirUnitInv;
        }
        logAddStirCauldron(nextStirLength);
        console.log("Straignten terminated by maximal length stirred.");
        break;
      }
      i = j;
    }
  }
  if (lastSegment) {
    // terminate by the end of path.
    console.log("straighten terminated by end of path.");
    logAddStirCauldron(Infinity);
  }
  console.log(
    "Added " + totalGrains + " grains of " + salt + " salt in total while straightening."
  );
  return totalGrains;
}

/** main function. */
function main() {
  // Your Script here...
  logSalt();
}

main();

/**
 * Useful for scripting offline.
 *Currently online plotter do not support exports. Delete these export lines.
 */
export {
  logAddIngredient,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddRotationSalt,
  // Wrapped operation instructions.
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  logAddSetPosition,
  // Zone detections.
  isVortex,
  // Stirring subroutines.
  stirIntoVortex,
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
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  // Extraction of other informations.
  checkBase,
  getCurrentVortexRadius,
  getTargetVortex,
  // Complex subroutines.
  straighten,
  // Utilities.
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
  getTotalMoon,
  getTotalSun,
  setDisplay,
  setStirRounding,
  logSalt,
};

export {
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
};
