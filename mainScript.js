import { pointDistance } from "@potionous/common";

import {
  addIngredient,
  addMoonSalt,
  addSunSalt,
  addHeatVortex,
  addStirCauldron,
  addPourSolvent,
  addSetPosition,
  createAddIngredient,
  createAddMoonSalt,
  createAddSunSalt,
  createPourSolvent,
  createHeatVortex,
  createStirCauldron,
  createSetPosition,
} from "@potionous/instructions";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, startingRecipeItems, currentRecipeItems } from "@potionous/plot";

const LuckyInfinity = 1437;
const SaltAngle = (2 * Math.PI) / 1000.0; // angle per salt in radian.
// Pouring unit of current version of plotter. All pours are multiply of this.
// Inverse is used for float accuracy.
const pourUnitInv = 125.0;
const StirUnitInv = 1000.0;
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
let Step = 1;
let TotalSun = 0;
let TotalMoon = 0;
/** Virtual mode structure */
let Virtual = false;
/** @type {import("@potionous/instructions").RecipeItem[]} */
let VirtualRecipeItems;
/** @type {import("@potionous/plot").PlotResult} */
let VirtualPlot;

/**
 * Enable virtual mode. All subsequent plotting and instruction addition will be done on a virtual plot, and will not affect the actual plot.
 * This allows you to test out and experiment with different plots without having to worry about overwriting the actual plot.
 * Can also be used to reset virtual mode.
 * To disable virtual mode, call unsetVirtual().
 */
function setVirtual() {
  Virtual = true;
  VirtualRecipeItems = currentRecipeItems;
  VirtualPlot = currentPlot;
}

/**
 * Disable virtual mode. All subsequent plotting and instruction addition will affect the actual plot.
 * To re-enable virtual mode, call setVirtual().
 */
function unsetVirtual() {
  Virtual = false;
}
function getRecipeItems() {
  if (Virtual) return VirtualRecipeItems;
  return currentRecipeItems;
}
function getPlot() {
  if (Virtual) return VirtualPlot;
  return currentPlot;
}
function updateVirtualPlot() {
  VirtualPlot = computePlot(VirtualRecipeItems);
}

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
function getEntityCoord(entity) {
  if (entity === undefined) return undefined;
  return { x: entity.x || 0.0, y: entity.y || 0.0 };
}

/**
 * Extracts the x and y coordinates from a given plot point, defaulting to the current point.
 * @param {import("@potionous/dataset").PlotPoint} point - The plot point to extract coordinates from.
 * @returns {{x: number, y: number}} - The extracted coordinates with defaults applied.
 */

function getCoord(point = getPlot().pendingPoints[0]) {
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
  throw Error();
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
    const base = PotionBases.current.id;
    if (base != expectedBase) {
      logError("checkBase", "" + base + " is not the expected base " + expectedBase + ".");
      return;
    }
  }
}

/**
 * Prints the total amount of moon and sun salt used so far in the script.
 */
function printSalt() {
  console.log("Total moon salt: " + TotalMoon + ", Total sun salt: " + TotalSun);
}

/**
 * Logging function to display the current step and the action taken.
 */

/**
 * Logs the addition of an ingredient and adds it to the current plot.
 * @param {string} ingredientId The ID of the ingredient to add.
 * @param {Object} [options] Options for the instruction.
 * @param {number} [options.grindPercent=1.0] The percentage of the ingredient to grind as a decimal (0-1).
 */
function logAddIngredient(ingredientId, grindPercent = 1.0) {
  if (!Virtual) {
    displayStep("Adding " + grindPercent * 100 + "% of " + ingredientId);
    Step += 1;
    addIngredient(ingredientId, grindPercent);
  } else {
    VirtualRecipeItems.push(createAddIngredient(ingredientId, grindPercent));
    updateVirtualPlot();
  }
  return createAddIngredient(ingredientId, grindPercent);
}
const logSkirt = (grindPercent = 1.0) => logAddIngredient(Ingredients.PhantomSkirt, grindPercent);

/**
 * Logs the addition of sun salt and adds it to the current plot.
 * @param {number} grains The amount of sun salt to add in grains.
 */
function logAddSunSalt(grains) {
  if (grains <= 0) return createAddSunSalt(0);
  if (!Virtual) {
    displayStep("Adding " + grains + " grains of sun salt");
    Step += 1;
    TotalSun += grains;
    addSunSalt(grains);
  } else {
    VirtualRecipeItems.push(createAddSunSalt(grains));
    updateVirtualPlot();
  }
  return createAddSunSalt(grains);
}

/**
 * Logs the addition of moon salt and adds it to the current plot.
 * @param {number} grains The amount of moon salt to add in grains.
 */
function logAddMoonSalt(grains) {
  if (grains <= 0) return createAddMoonSalt(0);
  if (!Virtual) {
    displayStep("Adding " + grains + " grains of moon salt");
    Step += 1;
    TotalMoon += grains;
    addMoonSalt(grains);
  } else {
    VirtualRecipeItems.push(createAddMoonSalt(grains));
    updateVirtualPlot();
  }
  return createAddMoonSalt(grains);
}

/**
 * Logs the addition of rotation salt and adds it to the current plot.
 * @param {"moon"|"sun"} salt The type of rotation salt to add ("sun" or "moon").
 * @param {number} grains The amount of salt to add in grains.
 */
function logAddRotationSalt(salt, grains) {
  if (salt == "moon") {
    return logAddMoonSalt(grains);
  }
  if (salt == "sun") {
    return logAddSunSalt(grains);
  }
  logError("adding rotation salt", "salt must be moon or sun.");
}

/**
 * Logs the addition of heat to a vortex and adds it to the current plot.
 * @param {number} length The amount of heat to add to the vortex in PotionCraft units.
 * @param {number} [round=0] 1 if rounding up, -1 if rounding down, 0 if not rounding.
 */
function logAddHeatVortex(length, round) {
  var _length;
  if (round > 0) {
    _length = Math.max(Math.ceil(length * pourUnitInv) - 0.5, 0) / pourUnitInv;
  } else {
    _length = Math.max(Math.floor(length * pourUnitInv) - 0.5, 0) / pourUnitInv;
  }
  if (_length <= 0) return createHeatVortex(0);
  if (!Virtual) {
    displayStep("Heat the vortex by " + _length + " distance.");
    Step += 1;
    addHeatVortex(Math.min(_length, LuckyInfinity));
  } else {
    VirtualRecipeItems.push(createHeatVortex(Math.min(_length, LuckyInfinity)));
    updateVirtualPlot();
  }
  return createHeatVortex(Math.min(_length, LuckyInfinity));
}

/**
 * Logs the addition of a stir cauldron instruction and adds it to the current plot.
 * @param {number} length The amount of stirring to add in PotionCraft units.
 * @param {Object} [options] Additional options.
 * @param {number} [options.shift] 1 if shifting up, -1 if shifting down, 0 if not shifting. Default to be 1.
 * @param {number} [options.buffer=1e-5] The shifted buffer to use whenthe stir length is not rounded.
 */
function logAddStirCauldron(length, options = {}) {
  const { shift = 1, buffer = 1e-5 } = options;
  let _length = Math.max(length, 0);
  if (RoundStirring && shift) {
    if (shift > 0) {
      _length = Math.ceil(_length * StirUnitInv) / StirUnitInv;
    } else {
      _length = Math.floor(_length * StirUnitInv) / StirUnitInv;
    }
  } else {
    _length += shift * buffer;
  }
  if (_length <= 0) return createStirCauldron(0);
  if (!Virtual) {
    displayStep("Stir the cauldron by " + _length + " distance.");
    Step += 1;
    addStirCauldron(Math.min(_length, LuckyInfinity));
  } else {
    VirtualRecipeItems.push(createStirCauldron(Math.min(_length, LuckyInfinity)));
    updateVirtualPlot();
  }
  return createStirCauldron(Math.min(_length, LuckyInfinity));
}
/**
 * Logs the addition of a pour solvent instruction and adds it to the current plot.
 * @param {number} length The amount of solvent to pour in PotionCraft units.
 * @param {Object} [options] Additional options.
 * @param {number} [options.shift] 1 if shifting up, -1 if shifting down, 0 if not shifting.
 */
function logAddPourSolvent(length, options = {}) {
  const { shift = 0 } = options;
  var _length = length;
  if (shift) {
    if (shift > 0) {
      _length = Math.max(Math.ceil(length * pourUnitInv) - 0.5, 0) / pourUnitInv;
    } else {
      _length = Math.max(Math.floor(length * pourUnitInv) - 0.5, 0) / pourUnitInv;
    }
  }
  if (_length <= 0) return createPourSolvent(0);
  if (!Virtual) {
    displayStep("Pour solvent by " + _length + " distance.");
    Step += 1;
    addPourSolvent(Math.min(_length, LuckyInfinity));
  } else {
    VirtualRecipeItems.push(createPourSolvent(Math.min(_length, LuckyInfinity)));
    updateVirtualPlot();
  }
  return createPourSolvent(Math.min(_length, LuckyInfinity));
}

/**
 * Logs the addition of a set position instruction and adds it to the current plot.
 * @param {number} x The x coordinate to set
 * @param {number} y The y coordinate to set
 */
function logAddSetPosition(x, y) {
  if (!Virtual) {
    displayStep("Teleporting to (" + x + ", " + y + ")");
    Step += 1;
    addSetPosition(x, y);
  } else {
    VirtualRecipeItems.push(createSetPosition(x, y));
    updateVirtualPlot();
  }
  return createSetPosition(x, y);
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
 * Stirs the potion into the next vortex.
 * @param {object} [options] - Options for the stirring process.
 * @param {number} [options.preStir=0.0] The amount of pre-stirring to add.
 */
function stirIntoVortexV2(options = {}) {
  const { preStir = 0.0 } = options;
  let pendingPoints = getPlot().pendingPoints;
  if (preStir > 0.0) {
    pendingPoints = computePlot(getRecipeItems().concat(createStirCauldron(preStir))).pendingPoints;
  }
  const currentVortex = getEntityCoord(pendingPoints[0].bottleCollisions.find(isVortex));
  let stir = 0.0;
  let i = 0;
  let point = getCoord(pendingPoints[0]);
  while (true) {
    i += 1;
    if (i == pendingPoints.length) {
      logError("stirring into vortex", "no vortex found.");
      return;
    }
    const vortex = getEntityCoord(pendingPoints[i].bottleCollisions.find(isVortex));
    if (
      vortex != undefined &&
      (currentVortex == undefined || vortex.x != currentVortex.x || vortex.y != currentVortex.y)
    ) {
      const next = getCoord(pendingPoints[i]);
      stir += intersectCircle(getVortexC(vortex), point, unitV(vSub(next, point))).d1;
      stir += preStir;
      return logAddStirCauldron(stir, { shift: 1 });
    }
    stir += pointDistance(pendingPoints[i - 1], pendingPoints[i]);
    point = getCoord(pendingPoints[i]);
  }
}
const stirIntoVortex = (preStir = 0.0) => stirIntoVortexV2({ preStir });

/**
 * Stirs the potion to the edge of the current vortex.
 * @param {object} [options] - Options for the stirring process.
 * @param {number} [options.preStir=0.0] The amount of pre-stirring to add.
 */
function stirToVortexEdgeV2(options = {}) {
  const { preStir = 0.0 } = options;
  let plot = getPlot();
  if (preStir > 0.0) {
    plot = computePlot(getRecipeItems().concat(createStirCauldron(preStir)));
  }
  const pendingPoints = plot.pendingPoints;
  const vortex = getVortexP(pendingPoints[0]);
  let stir = preStir;
  if (vortex === undefined) {
    logError("stirring to edge", "bottle not in a vortex.");
    return;
  }
  let i = 0;
  while (true) {
    i += 1;
    const result = getEntityCoord(pendingPoints[i].bottleCollisions.find(isVortex));
    if (result === undefined || result.x != vortex.x || result.y != vortex.y) {
      break;
    } else {
      if (i == pendingPoints.length) {
        logError("stirring to edge of vortex", "Can not reach the edge of the vortex.");
        return;
      }
      stir += pointDistance(pendingPoints[i - 1], pendingPoints[i]);
    }
  }
  const current = getCoord(pendingPoints[i - 1]);
  const next = getCoord(pendingPoints[i]);
  const iC = intersectCircle(vortex, current, unit(next.x - current.x, next.y - current.y));
  stir += iC.d2;
  return logAddStirCauldron(stir, { shift: -1 });
}
const stirToVortexEdge = (preStir = 0.0) => stirToVortexEdgeV2({ preStir });

/**
 * Stirs the potion until a change in direction is detected or the path is used up.
 *
 * @param {object} [options] - Options for the stirring process allowed beyond the initial length before stopping.
 * @param {number} [options.preStir=0.0] - The amount of pre-stirring to add.
 * @param {number} [options.directionBuffer=20 * SaltAngle] - The buffer angle used to determine the change in direction.
 * @param {number} [options.segmentLength=1e-9] - The minimal length of each segment of the potion path.
 */
function stirToTurn(options = {}) {
  const { preStir = 0.0, directionBuffer = 20 * SaltAngle, segmentLength = 1e-9 } = options;

  const minCosine = Math.cos(directionBuffer);
  let pendingPoints = getPlot().pendingPoints;
  if (preStir > 0.0) {
    pendingPoints = computePlot(getRecipeItems().concat(createStirCauldron(preStir))).pendingPoints;
  }
  let currentUnit = undefined;
  let i = 0;
  let j;
  let stir = preStir;
  let nextSegmentLength = 0.0;
  while (true) {
    j = i;
    while (true) {
      j += 1;
      if (j >= pendingPoints.length) {
        return logAddStirCauldron(Infinity);
      } // no turning point found before the end of path.
      nextSegmentLength += pointDistance(pendingPoints[j - 1], pendingPoints[j]);
      if (nextSegmentLength > segmentLength) {
        break;
      }
    }
    const nextUnit = unitV(vSub(pendingPoints[j], pendingPoints[i]));
    if (currentUnit != undefined && vProd(currentUnit, nextUnit) < minCosine) {
      return logAddStirCauldron(stir);
    } else {
      stir += nextSegmentLength;
      nextSegmentLength = 0.0;
      i = j;
      currentUnit = nextUnit;
    }
  }
}

/**
 * Stirs the potion until it enters or exits a specified zone.
 * @param {object} [options] - Options for the stirring process.
 * @param {object} [options.zone=Entity.DangerZone] - The zone to be entered or exited.
 * @param {number} [options.preStir=0.0] - The amount of pre-stirring to add.
 * @param {boolean} [options.overStir=false] - Whether to over stir by a small amount.
 * @param {boolean} [options.exitZone=false] - Whether to exit the zone instead of entering it.
 */
function stirToZone(options = {}) {
  const { preStir = 0.0, zone = Entity.DangerZone, overStir = false, exitZone = false } = options;
  let plot = getPlot();
  if (preStir > 0.0) {
    plot = computePlot(getRecipeItems().concat(createStirCauldron(preStir)));
  }
  const pendingPoints = plot.pendingPoints;
  let i = 0;
  let inZone = false;
  let stir = preStir;
  while (true) {
    i += 1;
    if (i == pendingPoints.length) {
      logError("stir to zone", "no zone found.");
      return;
    }
    stir += pointDistance(pendingPoints[i - 1], pendingPoints[i]);
    const result = pendingPoints[i].bottleCollisions.find(isEntityType(zone));
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
  return logAddStirCauldron(stir, { shift: 2 * overStir - 1 });
}
const stirToDangerZoneExit = (preStir = 0.0) => {
  stirToZone({ preStir, zone: Entity.DangerZone, exitZone: true, overStir: true });
};

/**
 * Stirs the potion towards the nearest point to the given target coordinates.
 * This stir is not rounded for precision.
 * @param {object} target - The target effect.
 * @param {number} target.x - The x-coordinate of the target effect.
 * @param {number} target.y - The y-coordinate of the target effect.
 * @param {object} options - Options for the stirToNearestTarget function.
 * @param {number} [options.preStir=0.0] - The amount of pre-stirring to add.
 * @param {number} [options.maxStir=Infinity] - The maximal stir length allowed in the optimization.
 * @param {number} [options.segmentLength=1e-9] - The minimal length of each segment in the optimization process.
 * @returns {instruction: import("@potionous/instructions").RecipeItem, distance: number} The added instruction and the optimal distance to the target.
 */
function stirToTarget(target, options = {}) {
  const { preStir = 0.0, maxStir = Infinity, segmentLength = 1e-9 } = options;
  let pendingPoints = getPlot().pendingPoints;
  if (preStir > 0.0) {
    pendingPoints = computePlot(getRecipeItems().concat(createStirCauldron(preStir))).pendingPoints;
  }
  const initialPoint = getCoord(pendingPoints[0]);
  const initialDistance = vMag(vSub(initialPoint, target));
  let isLastSegment = false;
  let currentStir = 0.0;
  let optimalStir = 0.0;
  let optimalDistance = initialDistance;
  let i = 0;
  let j = i;
  let nextSegmentLength = 0.0;
  let currentPoint = initialPoint;
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
    if (currentStir + nextSegmentLength > maxStir) {
      isLastSegment = true;
    }
    const next = getCoord(pendingPoints[j]);
    const nextUnit = unitV(vSub(next, currentPoint));
    const lastStir = vProd(nextUnit, vSub(target, currentPoint));
    if (lastStir > nextSegmentLength) {
      const nextDistance = vMag(vSub(target, next));
      if (nextDistance < optimalDistance) {
        optimalStir = currentStir + nextSegmentLength;
        optimalDistance = nextDistance;
      }
    } else {
      if (lastStir >= 0) {
        const lastOptimalDistance = Math.abs(vProd(vRot90(nextUnit), vSub(target, currentPoint)));
        if (lastOptimalDistance < optimalDistance) {
          optimalDistance = lastOptimalDistance;
          optimalStir = currentStir + lastStir;
        }
      }
    }
    i = j;
    currentPoint = getCoord(pendingPoints[i]);
    currentStir += nextSegmentLength;
    nextSegmentLength = 0.0;
  }
  return {
    instruction: logAddStirCauldron(optimalStir + preStir, { shift: 0 }),
    distance: optimalDistance,
  };
}

/**
 * Stirs the potion to the specified tier of a certain effect
 * This stir is not rounded for precision reason.
 * @param {{x: number, y: number, angle: number}} target - The target effect.
 * @param {object} options - Options for the stirring process.
 * @param {number} [options.preStir=0.0] - The amount of pre-stirring to add.
 * @param {number} [options.deviation=DeviationT2] - The maximal allowable deviation from the target effect.
 * @param {boolean} [options.ignoreAngle=false] - Whether to ignore the angle deviation.
 * @param {number} [options.segmentLength=1e-9] - The minimal length of each segment in the stirring path.
 * @param {number} [options.afterStir=1e-5] - The added length to ensure entrance.
 */
function stirToTier(target, options = {}) {
  const {
    preStir = 0.0,
    deviation = DeviationT2,
    ignoreAngle = false,
    segmentLength = 1e-9,
    afterStir = 1e-5,
  } = options;
  let pendingPoints = getPlot().pendingPoints;
  if (preStir > 0.0) {
    pendingPoints = computePlot(getRecipeItems().concat(createStirCauldron(preStir))).pendingPoints;
  }
  let cP = pendingPoints[0];
  let angleDeviation = 0.0;
  if (!ignoreAngle) {
    const currentAngle = -cP.angle || 0.0;
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
    const nP = pendingPoints[j];
    const iC = intersectCircle(
      { x: target.x, y: target.y, r: tierRadius },
      cP,
      unitV(vSub(nP, cP))
    );
    if (iC != undefined && iC.d1 >= 0.0 && iC.d1 < pointDistance(cP, nP)) {
      stir += iC.d1;
      return logAddStirCauldron(stir + afterStir, { shift: 0 });
    }
    stir += pointDistance(cP, nP);
    i = j;
    cP = nP;
  }
}

/**
 * Stirs the potion to consume a specified length while in a vortex.
 * This is not affected by stir rounding, since the stir length is manually input.
 * @param {number} length - The length of stirring to consume.
 */
function stirToConsume(length) {
  const point = getPlot().pendingPoints[0];
  const { x, y } = getCoord(point);
  const result = point.bottleCollisions.find(isVortex);
  if (result == undefined) {
    logError("stirring to consume", "bottle not in a vortex.");
    return;
  }
  let instructions = [];
  instructions.push(logAddStirCauldron(length, { shift: 0 }));
  instructions.push(logAddSetPosition(x, y));
  return instructions;
}

// Subroutines related to pouring solvent.

/**
 * Pours solvent to the edge of the current vortex.
 */

function pourToVortexEdge() {
  const p = getPlot().pendingPoints[0];
  const vortex = getVortexC(p);
  if (vortex === undefined) {
    logError("pouring to edge", "bottle not in a vortex.");
    return;
  }
  const current = getCoord(p);
  const pour = intersectCircle(vortex, current, unitV(vNeg(current))).d2;
  return logAddPourSolvent(pour, { shift: -1 });
}

/**
 * Pours solvent into the target vortex.
 *
 * @param {number} x - The x-coordinate of the target vortex.
 * @param {number} y - The y-coordinate of the target vortex.
 */
function pourIntoVortex(x, y) {
  const point = getPlot().pendingPoints[0];
  const vortex = getVortex(x, y);
  const iC = intersectCircle(vortex, point, unitV(vNeg(point)));
  if (iC === undefined || iC.d2 < 0.0) {
    logError(
      "pouring into target vortex",
      "bottle polar angle deviates too much or not behind the target vortex."
    );
    return;
  }
  const pour = iC.d1;
  return logAddPourSolvent(pour, { shift: 1 });
}

/**
 * Heats and pours to the edge of the current vortex.
 * @param {number} maxHeat - The maximum length to heat.
 * @param {number} repeats - The number of times to repeat the heating and pouring process.
 * @return {import("@potionous/instructions").RecipeItem[]} The instructions to be added to the recipe.
 */
function heatAndPourToEdge(maxHeat, repeats) {
  let instructions = [];
  const vC = getEntityCoord(getPlot().pendingPoints[0].bottleCollisions.find(isVortex));
  if (vC === undefined) {
    logError("pouring to edge", "bottle not in a vortex.");
    return;
  }
  const vR = getVortexC(vC).r;
  const c = 0.17; // the coefficient of the archimedean spiral formed by the vortex.
  const vD = vMag(vC);
  const alpha = Math.acos(vR / vD);
  const edgeLimit = unitV(vRot(vNeg(vC), -alpha));
  for (let i = 0; i < repeats; i++) {
    const point = getCoord(getPlot().pendingPoints[0]);
    let maxLength = Infinity;
    if (vProd(edgeLimit, vSub(point, vC)) > 0) {
      maxLength = vProd(vRot90(edgeLimit), vSub(point, vC)) - c;
      if (maxLength < 0) {
        break;
      }
      maxLength = maxLength * 0.75;
    }
    instructions.push(logAddHeatVortex(Math.min(maxHeat, maxLength)));
    instructions.push(pourToVortexEdge());
  }
  return instructions;
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
  const detector = isEntityType(zone);
  let instructions = [];
  if (prePour > 0) {
    instructions.push(logAddPourSolvent(prePour, { shift: 0 }));
  }
  const round = 2 * overPour - 1;
  const { x, y } = getCoord(getPlot().pendingPoints[0]);
  const plot = computePlot([createSetPosition(x, y), createPourSolvent(maxPour)]);
  let inZone = false;
  let i = 0;
  let pour = prePour;
  while (true) {
    let entity = plot.committedPoints[i].bottleCollisions.find(detector);
    if (entity != undefined) {
      if (!exitZone) {
        instructions.push(logAddPourSolvent(pour, { shift: round }));
        break;
      }
      inZone = true;
    }
    if (entity == undefined && inZone) {
      instructions.push(logAddPourSolvent(pour, { shift: round }));
      break;
    }
    pour = pointDistance(plot.committedPoints[0], plot.committedPoints[i]);
    i += 1;
    if (i == plot.committedPoints.length) {
      logError("pouring to zone", "cannot reach (or out of) zone.");
      return;
    }
  }
  return instructions;
}
const pourToZone = (maxPour = Infinity) => pourToZoneV2({ maxPour });

/**
 * Derotates the bottle to the target angle.
 * @param {number} targetAngle - The target angle in degrees.
 * @param {Object} [options] - Optional parameters for derotating.
 * @param {boolean} [options.toAngle=true] - Whether to derotate to the target angle or by the target angle.
 * @param {boolean} [options.overPour=false] - Whether pour slightly more (to derorate more).
 */
function derotateToAngle(targetAngle, options = {}) {
  const { toAngle = true, overPour = false } = options;
  var _targetAngle = targetAngle;
  let instructions = [];
  const initialPoint = getPlot().pendingPoints[0];
  const { x, y } = getCoord(initialPoint);
  const currentAngle = -initialPoint.angle;
  if (toAngle) {
    if (targetAngle * (targetAngle - currentAngle) > 0) {
      logError("derotating", "Cannot derotate to larger or reversed angle.");
    }
  } else {
    _targetAngle = currentAngle - (2 * (currentAngle > 0) - 1) * targetAngle;
  }
  const atOrigin = x == 0.0 && y == 0.0;
  if (!atOrigin) {
    const result = initialPoint.bottleCollisions.find(isVortex);
    if (result == undefined) {
      logError("derotating", "Cannot derotate outside vortex.");
      return;
    }
    instructions.push(logAddSetPosition(0, 0));
  }
  instructions.push(pourUntilAngle(_targetAngle, { overPour }));
  if (!atOrigin) instructions.push(logAddSetPosition(x, y));
  return instructions;
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
  const point = getPlot().pendingPoints[0];
  const currentAngle = -point.angle || 0.0;
  if (targetAngle * (targetAngle - currentAngle) <= 0) {
    const {
      minPour = 0.0,
      maxPour = Infinity,
      epsHigh = EpsHigh,
      epsLow = EpsLow,
      buffer = 0.012,
      overPour = true,
    } = options;
    const round = 2 * overPour - 1;
    const dist = vMag(getCoord(point));
    /** @type {import("@potionous/instructions").RecipeItem[]} */
    const instructions = [];
    var toOrigin = false;
    var _angleAtOrigin =
      -computePlot(getRecipeItems().concat(createPourSolvent(dist))).pendingPoints[0].angle || 0.0;
    var l, r, e;
    if (targetAngle * (targetAngle - _angleAtOrigin) <= 0) {
      instructions.push(logAddPourSolvent(dist));
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
      const plot = computePlot(getRecipeItems().concat(createPourSolvent(m)));
      const testAngle = -plot.pendingPoints[0].angle;
      if (targetAngle * (targetAngle - testAngle) <= 0) {
        l = m;
      } else {
        r = m;
      }
    }
    if (!toOrigin) {
      instructions.push(logAddPourSolvent(r, { shift: round }));
    } else {
      instructions.push(logAddPourSolvent(l + (r - l) / 2, { shift: 0 }));
    }
    return instructions;
  }
  logError("pourUntilAngle", "Cannot pour to larger or reversed angle.");
  return [];
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
function getAngleOrigin(toBottle = true) {
  let { x, y } = getCoord();
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
function getAngleEntity(expectedEntityTypes = Entity.Vortex, toBottle = true) {
  const point = getPlot().pendingPoints[0];
  const pC = getCoord(point);
  /** @type {{x: number, y: number}|undefined} */
  let eC;
  for (let i = 0; i < expectedEntityTypes.length; i++) {
    eC = getEntityCoord(
      point.bottleCollisions.find((x) => x.entityType === expectedEntityTypes[i])
    );
    if (eC !== undefined) break;
  }
  if (eC === undefined) {
    logError("getting bottle polar angle by entity", "given entity not found.");
    return 0.0;
  }
  let delta = vSub(pC, eC);
  if (!toBottle) delta = vNeg(delta);
  return vecToDir(delta);
}

/**
 * Compute the direction of stirring at current point.
 * @param {number} [segmentLength=1e-9] - The minimal length of each segment of the potion path.
 * @returns {number} The direction angle in radians.
 */
function getStirDirection(segmentLength = 1e-9) {
  const pendingPoints = getPlot().pendingPoints;
  /** the points have no coordinate at origin */
  const from = getCoord();
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
  }
  const to = getCoord(pendingPoints[i]);
  return vecToDir(vSub(to, from));
}

/**
 * Compute the direction of heating a vortex at current point.
 * @returns {number} The direction angle in radians.
 */
function getHeatDirection() {
  const point = getPlot().pendingPoints[0];
  const vC = getEntityCoord(point.bottleCollisions.find(isVortex));
  if (vC == undefined) {
    logError("getting current heat direction", "no vortex at current position.");
    return 0.0;
  }
  const c = 0.16;
  const pC = getCoord(point);
  const dist = vMag(vSub(vC, pC));
  const rot = Math.atan(c / dist);
  return vecToDir(vRot(vSub(pC, vC), -Math.PI / 2 - rot));
}

/**
 * Retrieves information about the target vortex at specified coordinates.
 * @param {number} x - The x-coordinate of the target vortex.
 * @param {number} y - The y-coordinate of the target vortex.
 * @returns {{x:number, y:number, r:number}} An object containing the x and y
 * coordinates and the radius of the target vortex.
 */
function getVortex(x, y) {
  const result = getEntityCoord(
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
const getVortexC = (point = getCoord()) => getVortex(point.x || 0.0, point.y || 0.0);
const getVortexP = (point = getPlot().pendingPoints[0]) => getVortexC(getCoord(point));

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
 * @param {number} [options.preStir=0] The amount of salt to be added before stirring.
 * @param {number} [options.maxStir=Infinity] The maximum distance to be stirred.
 * @param {number} [options.maxGrains=Infinity] The maximum amount of salt to be added.
 * @param {boolean} [options.ignoreReverse=true] If set to false, the function will terminate when a reversed direction is detected.
 * @param {number} [options.segmentLength=1e-9] The minimal length of each segment of the potion path.
 */
function straighten(direction, salt, options = {}) {
  if (salt != "moon" && salt != "sun") {
    logError("straightening", "salt must be moon or sun.");
    return 0;
  }
  const {
    preStir = 0,
    maxStir = Infinity,
    maxGrains = Infinity,
    ignoreReverse = true,
    segmentLength = 1e-9,
  } = options;
  const _maxStir = maxStir;
  var instructions = [];
  let stirredLength = 0.0;
  let nextStir = 0.0;
  let nextSegmentLength = 0.0;
  let totalGrains = 0;
  let pendingPoints = getPlot().pendingPoints;
  if (preStir) {
    pendingPoints = computePlot(getRecipeItems().concat(createStirCauldron(preStir))).pendingPoints;
  }
  let _preStir = preStir;
  let lastSegment = false;
  let i = 0;
  while (!lastSegment) {
    const current = getCoord(pendingPoints[i]);
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
      const instruction = logAddStirCauldron(nextStir + _preStir);
      _preStir = 0.0;
      if (instruction.distance > 0) {
        stirredLength += nextStir;
        instructions.push(instruction);
      }
      i = 0;
      nextSegmentLength = 0.0;
      nextStir = 0.0;
      if (totalGrains + grains >= maxGrains) {
        // capped grains
        grains = maxGrains - totalGrains;
        totalGrains += grains;
        instructions.push(logAddRotationSalt(salt, grains));
        console.log("Straignten terminated by maximal grains of salt added.");
        break;
      } else {
        totalGrains += grains;
        instructions.push(logAddRotationSalt(salt, grains));
        // recalculate the new plotter after stir and salt.
        pendingPoints = getPlot().pendingPoints;
      }
    } else {
      nextStir += nextSegmentLength;
      nextSegmentLength = 0.0;
      if (nextStir + stirredLength >= _maxStir) {
        // capped stir length.
        nextStir = _maxStir - stirredLength;
        instructions.push(logAddStirCauldron(nextStir + _preStir));
        console.log("Straignten terminated by maximal length stirred.");
        break;
      }
      i = j;
    }
  }
  if (lastSegment) {
    // terminate by the end of path.
    console.log("straighten terminated by end of path.");
    instructions.push(logAddStirCauldron(Infinity));
  }
  console.log(
    "Added " + totalGrains + " grains of " + salt + " salt in total while straightening."
  );
  return instructions;
}

/** main function. */
function main() {
  // Your Script here...
  printSalt();
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
  stirIntoVortexV2,
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
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  // Extraction of other informations.
  checkBase,
  getVortex,
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
  setVirtual,
  unsetVirtual,
  getRecipeItems,
  getPlot,
  setDisplay,
  setStirRounding,
  printSalt,
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
