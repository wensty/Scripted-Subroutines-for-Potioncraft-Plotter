import { pointDistance } from "@potionous/common";

import {
  addIngredient,
  addVoidSalt,
  addMoonSalt,
  addSunSalt,
  addHeatVortex,
  addStirCauldron,
  addPourSolvent,
  addSetPosition,
  addSetRotation,
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
import { currentPlot, computePlot, startingRecipeItems, currentRecipeItems } from "@potionous/plot";
/** @type {import("@potionous/plot").PlotPoint} */
const Origin = {
  source: { type: "warden" },
  x: 0.0,
  y: 0.0,
  angle: 0.0,
  health: 1.0,
  isTeleportation: false,
  bottleCollisions: [],
};

const LuckyInfinity = 1437;
const SaltAngle = (2 * Math.PI) / 1000.0; // angle per salt in radian.
const pourUnitInv = 125.0;
const StirUnitInv = 1000.0;
const VortexRadiusLarge = 2.39;
const VortexRadiusMedium = 1.99;
const VortexRadiusSmall = 1.74;
let Eps = 1e-9;
let PourRoundBuffer = 7e-5;
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
/** @type {{Moon: "moon", Sun: "sun"}} */
const SaltNames = { Moon: "moon", Sun: "sun" };
/** @type {{Water: "water", Oil: "oil", Wine: "wine"}} */
const BaseNames = { Water: "water", Oil: "oil", Wine: "wine" };
let Display = false; // Macro to switch instruction display.
/** @type {{point:{x: number, y: number}, direction:number}[]} */
let StraightenLines = [];
let AuxLineLength = 2;
let RoundStirring = true; // macro to control whether round stirrings.
/** Global Varibales */
let Step = 1;
let TotalSun = 0;
let TotalMoon = 0;
let TotalStir = 0;
let RemainingPath = 0;
/** Virtual Mode Structures */
let Virtual = false;
/** @type {readonly import("@potionous/instructions").RecipeItem[]} */
let VRecipeItems; // immutable.
/** @type {import("@potionous/plot").PlotResult} */
let VPlot;
let VTotalSun = 0;
let VTotalMoon = 0;
let VTotalStir = 0;
let VRemainingPath = 0;

/**
 * Enable virtual mode. All subsequent plotting and instruction addition will be done on a virtual plot, and will not affect the actual plot.
 * This allows you to test out and experiment with different plots without having to worry about overwriting the actual plot.
 * Can also be used to reset virtual mode.
 * To disable virtual mode, call `unsetVirtual()`.
 */
function setVirtual() {
  if (!Virtual) {
    console.log("Virtual mode enabled.");
    Virtual = true;
  }
  VRecipeItems = currentRecipeItems;
  VPlot = currentPlot;
  VTotalSun = TotalSun;
  VTotalMoon = TotalMoon;
  VTotalStir = TotalStir;
  VRemainingPath = RemainingPath;
}

/**
 * Disable virtual mode. All subsequent plotting and instruction addition will affect the actual plot.
 * To re-enable virtual mode, call `setVirtual()`.
 */
function unsetVirtual() {
  console.log("Virtual mode disabled.");
  Virtual = false;
}
const getRecipeItems = () => (Virtual ? VRecipeItems : currentRecipeItems);
const getPlot = () => (Virtual ? VPlot : currentPlot);
/** @type {(preStir: number) => import("@potionous/plot").PlotResult} */
const getPSPlot = (preStir) =>
  preStir > 0.0 ? computePlot(getRecipeItems().concat(createStirCauldron(preStir))) : getPlot();
function updateVirtualPlot() {
  VPlot = computePlot(VRecipeItems);
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
 * Returns the current point in the plot, which is the first pending point or the last committed point.
 * If there are no points in the plot, throws an error with the message "No current point.".
 * @param {import("@potionous/plot").PlotResult} plot - The plot to get the current point from.
 * @returns {import("@potionous/plot").PlotPoint} - The current point in the plot.
 */
function getCurrentPoint(plot = getPlot()) {
  return plot.committedPoints.at(-1) || Origin;
}

/**
 * Extracts the x and y coordinates from a given plot point, defaulting to the current point.
 * @param {import("@potionous/plot").PlotPoint} point - The plot point to extract coordinates from.
 * @returns {{x: number, y: number}} - The extracted coordinates with defaults applied.
 */
function getCoord(point = getCurrentPoint()) {
  const { x, y } = point;
  return { x: x || 0.0, y: y || 0.0 };
}
/** @type {(plot: import("@potionous/plot").PlotResult) => {x: number, y: number}} */
const getCurrentCoord = (plot) => getCoord(getCurrentPoint(plot));

/**
 * Computes the next segment of a given potion path.
 * @param {import("@potionous/plot").PlotPoint} cp - The current point.
 * @param {readonly import("@potionous/plot").PlotPoint[]} pps - The potion path.
 * @param {number} i - The starting index of the segment.
 * @param {number} [eps=MinSegment] - The minimal length of each segment.
 * @returns {{nextIndex: number, nextSegment: number, endPath: boolean}} - The next index, next segment length, and whether the path has ended.
 */
function getNextSegment(cp, pps, i, eps = Eps) {
  let j = i;
  let nextSegment = 0.0;
  let endPath = false;
  while (true) {
    if (j == pps.length) {
      endPath = true;
      break;
    }
    nextSegment += pointDistance(cp, pps[j]);
    if (nextSegment > eps) {
      break;
    }
    cp = pps[j];
    j += 1;
  }
  return { nextIndex: j, nextSegment, endPath };
}

/** returns an error message.
 * @param {string} operation - The operation that caused the error.
 * @param {string} info - Additional information about the error.
 */
const errorMsg = (operation, info) => "Error while " + operation + ": " + info;

/** @type {(eps: number) => void} */
const setEps = (eps) => {
  Eps = eps;
};

/** @type {(num: number) => void} */
const setAuxLineLength = (num) => {
  AuxLineLength = num;
};
/** @type {(num: number) => void} */
const setPourRoundBuffer = (num) => {
  PourRoundBuffer = num;
};

/**
 * Draw the auxiliary line of straightening with paths of arcane crystals.
 * @param {number} [num=AuxLineLength] - The number of arcane crystals to draw at each position.
 */
function drawAuxLine(num = AuxLineLength) {
  addVoidSalt(20000); // remove remaining path.
  for (let i = 0; i < StraightenLines.length; i++) {
    const { point, direction } = StraightenLines[i];
    const rD = relDir(direction, Math.PI / 4); // Base direction of the straight arcane crystals.
    logAddSetRotation(0);
    for (let j = 0; j < num; j++) {
      logAddIngredient(Ingredients.ArcaneCrystal);
    }
    logAddSetPosition(point.x, point.y);
    logAddSetRotation(radToDeg(rD));
    logAddStirCauldron(1);
  }
}

/**
 * Sets the display flag to control instruction display.
 */
function setDisplay(display = true) {
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
 * A guarded version of intersectCircle.
 * Logs an error if no intersection is found.
 * @param {{x: number, y: number, r: number}} circle - The circle to intersect with.
 * @param {{x: number, y: number}} point - The point on the line.
 * @param {{x: number, y: number}} direction - The direction of the line.
 * @returns {{d1: number, d2: number}} An object with the left and right intersection points, or undefined if no intersection is found.
 */
const intersectCircleG = (circle, point, direction) => {
  const ic = intersectCircle(circle, point, direction);
  if (ic === undefined) {
    throw errorMsg("intersectCircle", "No intersection found.");
  }
  return ic;
};

/**
 * Checks if the currentpotion base is the given expected base.
 * @param {"water"|"oil"|"wine"} expectedBase The expected base name.
 */
function checkBase(expectedBase) {
  if (!["water", "oil", "wine"].includes(expectedBase)) {
    throw errorMsg("checkBase", "Unknown expected base: " + expectedBase + ".");
  } else {
    const base = PotionBases.current.id;
    if (base != expectedBase) {
      throw errorMsg("checkBase", "" + base + " is not the expected base " + expectedBase + ".");
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
 * @param {import("@potionous/dataset").IngredientId} ingredientId The ID of the ingredient to add.
 * @param {number} [grindPercent=1.0] The percentage of the ingredient to grind as a decimal (0-1).
 */
function logAddIngredient(ingredientId, grindPercent = 1.0) {
  if (!Virtual) {
    displayStep("Adding " + grindPercent * 100 + "% of " + ingredientId);
    Step += 1;
    RemainingPath += Ingredients.get(ingredientId).computeLength(grindPercent);
    addIngredient(ingredientId, grindPercent);
  } else {
    VRemainingPath += Ingredients.get(ingredientId).computeLength(grindPercent);
    VRecipeItems = VRecipeItems.concat(createAddIngredient(ingredientId, grindPercent));
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
    VTotalSun += grains;
    VRecipeItems = VRecipeItems.concat(createAddSunSalt(grains));
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
    VTotalMoon += grains;
    VRecipeItems = VRecipeItems.concat(createAddMoonSalt(grains));
    updateVirtualPlot();
  }
  return createAddMoonSalt(grains);
}

/**
 * Logs the addition of rotation salt and adds it to the current plot.
 * @param {string} salt The type of rotation salt to add ("sun" or "moon").
 * @param {number} grains The amount of salt to add in grains.
 */
function logAddRotationSalt(salt, grains) {
  if (salt == "moon") {
    return logAddMoonSalt(grains);
  }
  if (salt == "sun") {
    return logAddSunSalt(grains);
  }
  throw errorMsg("logAddRotationSalt", "Unknown salt type: " + salt + ".");
}

/**
 * Logs the addition of heat to a vortex and adds it to the current plot.
 * @param {number} length The amount of heat to add to the vortex in PotionCraft units.
 * @param {number} [shift=0] 1 if rounding up, -1 if rounding down, 0 if not rounding.
 */
function logAddHeatVortex(length, shift = 0) {
  var _length;
  if (shift > 0) {
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
    VRecipeItems = VRecipeItems.concat(createHeatVortex(Math.min(_length, LuckyInfinity)));
    updateVirtualPlot();
  }
  return createHeatVortex(Math.min(_length, LuckyInfinity));
}

/**
 * Logs the addition of a stir cauldron instruction and adds it to the current plot.
 * @param {number} length The amount of stirring to add in PotionCraft units.
 * @param {Object} [options] Additional options.
 * @param {number} [options.shift] 1 if shifting up, -1 if shifting down, 0 if not shifting. Default to be 0, other functions using this have their own specifcation.
 * @param {number} [options.buffer=1e-5] The shifted buffer to use whenthe stir length is not rounded.
 */
function logAddStirCauldron(length, options = {}) {
  const { shift = 0, buffer = 1e-5 } = options;
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
    const stir = Math.min(_length, RemainingPath);
    TotalStir += stir;
    RemainingPath -= stir;
    addStirCauldron(Math.min(_length, LuckyInfinity));
  } else {
    const stir = Math.min(_length, VRemainingPath);
    VTotalStir += stir;
    VRemainingPath -= stir;
    VRecipeItems = VRecipeItems.concat(createStirCauldron(Math.min(_length, LuckyInfinity)));
    updateVirtualPlot();
  }
  return createStirCauldron(Math.min(_length, LuckyInfinity));
}
/**
 * Logs the addition of a pour solvent instruction and adds it to the current plot.
 * @param {number} length The amount of solvent to pour in PotionCraft units.
 * @param {Object} [options] Additional options.
 * @param {number} [options.buffer=prePourBuffer] The shifted buffer to use when the pour length is not rounded.
 * @param {number} [options.shift] 1 if shifting up, -1 if shifting down, 0 if not shifting.
 */
function logAddPourSolvent(length, options = {}) {
  const { shift = 0, buffer = PourRoundBuffer } = options;
  var _length = length;
  if (shift) {
    if (shift > 0) {
      _length = Math.max(Math.ceil((length + buffer) * pourUnitInv) - 0.5, 0) / pourUnitInv;
    } else {
      _length = Math.max(Math.floor((length - buffer) * pourUnitInv) - 0.5, 0) / pourUnitInv;
    }
  }
  if (_length <= 0) return createPourSolvent(0);
  if (!Virtual) {
    displayStep("Pour solvent by " + _length + " distance.");
    Step += 1;
    addPourSolvent(Math.min(_length, LuckyInfinity));
  } else {
    VRecipeItems = VRecipeItems.concat(createPourSolvent(Math.min(_length, LuckyInfinity)));
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
    VRecipeItems = VRecipeItems.concat(createSetPosition(x, y));
    updateVirtualPlot();
  }
  return createSetPosition(x, y);
}

/**
 * Logs the addition of a set rotation instruction and adds it to the current plot.
 * @param {number} angle The angle to set in degrees.
 */
function logAddSetRotation(angle) {
  if (!Virtual) {
    displayStep("Rotate by " + -angle + " degrees.");
    Step += 1;
    addSetRotation(-angle);
  } else {
    VRecipeItems = VRecipeItems.concat(createSetRotation(-angle));
    updateVirtualPlot();
  }
  return createSetRotation(-angle);
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
  const plot = getPSPlot(preStir);
  const pps = plot.pendingPoints;
  let cp = getCurrentPoint(plot);
  const vc1 = getEntityCoord(cp.bottleCollisions.find(isVortex));
  let stir = 0.0;
  let j = 0;
  while (true) {
    if (j >= pps.length) {
      throw errorMsg("stirring into vortex", "no vortex found.");
    }
    const vc2 = getEntityCoord(pps[j].bottleCollisions.find(isVortex));
    if (vc2 && (!vc1 || vc2.x != vc1.x || vc2.y != vc1.y)) {
      const pc1 = getCoord(cp);
      const pc2 = getCoord(pps[j]);
      stir += intersectCircleG(getVortexC(vc2), pc1, unitV(vSub(pc2, pc1))).d1;
      stir += preStir;
      return logAddStirCauldron(stir, { shift: 1 });
    }
    stir += pointDistance(cp, pps[j]);
    cp = pps[j];
    j += 1;
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
  const plot = getPSPlot(preStir);
  let cp = getCurrentPoint(plot);
  const pps = plot.pendingPoints;
  const vortex = getVortexP(getCurrentPoint());
  let stir = preStir;
  let j = 0;
  while (true) {
    if (j == pps.length) {
      throw errorMsg("stirring to edge of vortex", "Can not reach the edge of the vortex.");
    }
    const result = getEntityCoord(pps[j].bottleCollisions.find(isVortex));
    if (result === undefined || result.x != vortex.x || result.y != vortex.y) {
      break;
    } else {
      stir += pointDistance(cp, pps[j]);
    }
    cp = pps[j];
    j += 1;
  }
  const pc1 = getCoord(cp);
  const pc2 = getCoord(pps[j]);
  const ic = intersectCircleG(vortex, pc1, unitV(vSub(pc2, pc1)));
  stir += ic.d2;
  return logAddStirCauldron(stir, { shift: -1 });
}
const stirToVortexEdge = (preStir = 0.0) => stirToVortexEdgeV2({ preStir });

/**
 * Stirs the potion until a change in direction is detected or the path is used up.
 *
 * @param {object} [options] - Options for the stirring process allowed beyond the initial length before stopping.
 * @param {number} [options.preStir=0.0] - The amount of pre-stirring to add.
 * @param {number} [options.directionBuffer=20 * SaltAngle] - The buffer angle used to determine the change in direction.
 */
function stirToTurn(options = {}) {
  const { preStir = 0.0, directionBuffer = 20 * SaltAngle } = options;
  const minCosine = Math.cos(directionBuffer);
  const plot = getPSPlot(preStir);
  let cp = getCurrentPoint(plot);
  const pps = plot.pendingPoints;
  let currentUnit = undefined;
  let i = 0;
  let stir = preStir;
  while (true) {
    const { nextIndex: j, nextSegment, endPath } = getNextSegment(cp, pps, i);
    if (endPath) return logAddStirCauldron(Infinity); // no turning point until end of path.
    const nextUnit = unitV(vSub(pps[j], cp));
    if (currentUnit != undefined && vProd(currentUnit, nextUnit) < minCosine) {
      return logAddStirCauldron(stir, { shift: 1 });
    } else {
      stir += nextSegment;
      cp = pps[j];
      i = j;
      currentUnit = nextUnit;
    }
  }
}

/**
 * Stirs the potion until it enters or exits a specified zone.
 * @param {object} [options] - Options for the stirring process.
 * @param {string[]} [options.zone=Entity.DangerZone] - The zone to be entered or exited.
 * @param {number} [options.preStir=0.0] - The amount of pre-stirring to add.
 * @param {boolean} [options.overStir=false] - Whether to over stir by a small amount.
 * @param {boolean} [options.exitZone=false] - Whether to exit the zone instead of entering it.
 */
function stirToZone(options = {}) {
  const { preStir = 0.0, zone = Entity.DangerZone, overStir = false, exitZone = false } = options;
  const plot = getPSPlot(preStir);
  let cp = getCurrentPoint(plot);
  const pps = plot.pendingPoints;
  let j = 0;
  let inZone = false;
  let stir = preStir;
  while (true) {
    if (j == pps.length) {
      throw errorMsg("stir to zone", "no given zone found.");
    }
    stir += pointDistance(cp, pps[j]);
    const result = pps[j].bottleCollisions.find(isEntityType(zone));
    if (result) {
      if (!exitZone) {
        break;
      }
      inZone = true;
    } else {
      if (inZone) {
        break;
      }
    }
    cp = pps[j];
    j += 1;
  }
  return logAddStirCauldron(stir, { shift: overStir ? 1 : -1 });
}
const stirToDangerZoneExit = (preStir = 0.0) =>
  stirToZone({ preStir, zone: Entity.DangerZone, exitZone: true, overStir: true });

/**
 * Stirs the potion towards the nearest point to the given target coordinates.
 * This stir is not rounded for precision.
 * @param {{x: number, y: number}} target - The coordinate of target effect.
 * @param {object} options - Options for the stirToNearestTarget function.
 * @param {number} [options.preStir=0.0] - The amount of pre-stirring to add.
 * @param {number} [options.maxStir=Infinity] - The maximal stir length allowed in the optimization.
 * @returns {{instruction: import("@potionous/instructions").RecipeItem, distance: number}} The added instruction and the optimal distance to the target.
 */
function stirToTarget(target, options = {}) {
  const { preStir = 0.0, maxStir = Infinity } = options;
  const plot = getPSPlot(preStir);
  let cp = getCurrentPoint(plot);
  const pps = plot.pendingPoints;
  let isLastSegment = false;
  let currentStir = 0.0;
  let bestStir = 0.0;
  let bestDistance = vMag(vSub(cp, target));
  let i = 0;
  while (!isLastSegment) {
    const { nextIndex: j, nextSegment, endPath } = getNextSegment(cp, pps, i);
    if (endPath) {
      isLastSegment = true;
    }
    if (currentStir + nextSegment > maxStir) {
      isLastSegment = true;
    }
    const pc1 = getCoord(cp);
    const pc2 = getCoord(pps[j]);
    const unit = unitV(vSub(pc2, pc1));
    const lastStir = vProd(unit, vSub(target, pc1));
    if (lastStir > nextSegment) {
      const distance = vMag(vSub(target, pc2));
      if (distance < bestDistance) {
        bestStir = currentStir + nextSegment;
        bestDistance = distance;
      }
    } else {
      if (lastStir >= 0) {
        const lastOptimalDistance = Math.abs(vProd(vRot90(unit), vSub(target, pc1)));
        if (lastOptimalDistance < bestDistance) {
          bestDistance = lastOptimalDistance;
          bestStir = currentStir + lastStir;
        }
      }
    }
    cp = pps[j];
    i = j;
    currentStir += nextSegment;
  }
  return {
    instruction: logAddStirCauldron(bestStir + preStir, { shift: 0 }),
    distance: bestDistance,
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
 * @param {number} [options.afterStir=1e-13] - The added length to ensure entrance.
 */
function stirToTier(target, options = {}) {
  const {
    preStir = 0.0,
    deviation = DeviationT2,
    ignoreAngle = false,
    afterStir = 1e-13,
  } = options;
  const plot = getPSPlot(preStir);
  let cp = getCurrentPoint(plot);
  const pps = plot.pendingPoints;
  let angleDeviation = 0.0;
  if (!ignoreAngle) {
    const currentAngle = -cp.angle || 0.0;
    const angleDelta = radToDeg(Math.abs(relDir(degToRad(currentAngle), degToRad(target.angle))));
    angleDeviation = (angleDelta * 100.0) / 12.0;
    if (angleDeviation >= deviation) {
      throw errorMsg("stir to tier", "too much angle deviation.");
    }
  }
  const tierRadius = (deviation - angleDeviation) / 1800.0;
  let i = 0;
  let stir = preStir;
  while (true) {
    const { nextIndex: j, nextSegment, endPath } = getNextSegment(cp, pps, i);
    if (endPath) {
      throw errorMsg("stirring to tier", "cannot reach target tier.");
    }
    const np = pps[j];
    const ic = intersectCircle(
      { x: target.x, y: target.y, r: tierRadius },
      cp,
      unitV(vSub(np, cp))
    );
    if (ic != undefined && ic.d1 >= 0.0 && ic.d1 < pointDistance(cp, np)) {
      stir += ic.d1;
      return logAddStirCauldron(stir + afterStir, { shift: 0 });
    }
    stir += nextSegment;
    i = j;
    cp = np;
  }
}

/**
 * Stirs the potion to consume a specified length while in a vortex.
 * This is not affected by stir rounding, since the stir length is manually input.
 * @param {number} length - The length of stirring to consume.
 * @param {number} [oneStir=Infinity] - The length of a single stir.
 */
function stirToConsume(length, oneStir = Infinity) {
  const point = getCurrentPoint();
  const { x, y } = getCoord(point);
  const result = point.bottleCollisions.find(isVortex);
  if (result == undefined) {
    throw errorMsg("stirring to consume", "bottle not in a vortex.");
  }
  /** @type {import("@potionous/instructions").RecipeItem[]} */
  let instructions = [];
  let _length = length;
  while (_length > oneStir) {
    instructions.push(logAddStirCauldron(oneStir, { shift: 0 }));
    instructions.push(logAddSetPosition(x, y));
    _length -= oneStir;
  }
  instructions.push(logAddStirCauldron(_length, { shift: 0 }));
  instructions.push(logAddSetPosition(x, y));
  return instructions;
}

// Subroutines related to pouring solvent.

/**
 * Pours solvent to move the bottle to the edge of the current vortex.
 */
function pourToVortexEdge() {
  const p = getCurrentPoint();
  const vortex = getVortexC(p);
  if (vortex === undefined) {
    throw errorMsg("pouring to edge", "bottle not in a vortex.");
  }
  const current = getCoord(p);
  const pour = intersectCircleG(vortex, current, unitV(vNeg(current))).d2;
  return logAddPourSolvent(pour, { shift: -1 });
}

/**
 * Pours solvent to move the bottle into the target vortex.
 *
 * @param {number} x - The x-coordinate of the target vortex.
 * @param {number} y - The y-coordinate of the target vortex.
 */
function pourIntoVortex(x, y) {
  const point = getCurrentPoint();
  const vortex = getVortex(x, y);
  const ic = intersectCircle(vortex, point, unitV(vNeg(point)));
  if (ic === undefined) {
    throw errorMsg("pouring into vortex", "bottle angle deviates too much.");
  }
  if (ic.d2 < 0.0) {
    throw errorMsg("pouring into vortex", "bottle not behind the target vortex.");
  }
  const pour = ic.d1;
  return logAddPourSolvent(pour, { shift: 1 });
}

/**
 * Repeat heats and pours to move the bottle along the edge of the current vortex.
 * @param {number} maxHeat - The maximum length to heat.
 * @param {number} repeats - The number of times to repeat the heating and pouring process.
 */
function heatAndPourToEdge(maxHeat, repeats) {
  /** @type {import("@potionous/instructions").RecipeItem[]} */
  let instructions = [];
  const vC = getEntityCoord(getCurrentPoint().bottleCollisions.find(isVortex));
  if (vC === undefined) {
    throw errorMsg("pouring to edge", "bottle not in a vortex.");
  }
  const vR = getVortexC(vC).r;
  const c = 0.17; // the coefficient of the archimedean spiral formed by the vortex.
  const vD = vMag(vC);
  const alpha = Math.acos(vR / vD);
  const edgeLimit = unitV(vRot(vNeg(vC), -alpha));
  for (let i = 0; i < repeats; i++) {
    const point = getCoord();
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
  /** @type {import("@potionous/instructions").RecipeItem[]} */
  let instructions = [];
  if (prePour > 0) {
    instructions.push(logAddPourSolvent(prePour, { shift: 0 }));
  }
  const round = overPour ? 1 : -1;
  const { x, y } = getCoord();
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
      throw errorMsg("pouring to zone", "cannot reach (or out of) zone.");
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
 */
function derotateToAngle(targetAngle, options = {}) {
  const { toAngle = true } = options;
  let _targetAngle = targetAngle;
  const initialPoint = getCurrentPoint();
  const { x, y } = getCoord(initialPoint);
  const currentAngle = -initialPoint.angle || 0.0;
  if (toAngle) {
    if (targetAngle * (targetAngle - currentAngle) > 0) {
      throw errorMsg("derotating", "Cannot derotate to larger or reversed angle.");
    }
  } else {
    _targetAngle = currentAngle - (currentAngle > 0 ? 1 : -1) * targetAngle;
  }
  const atOrigin = x == 0.0 && y == 0.0;
  if (!atOrigin) {
    const result = initialPoint.bottleCollisions.find(isVortex);
    if (result == undefined) {
      throw errorMsg("derotating", "Cannot derotate outside vortex.");
    }
  }
  return logAddSetRotation(_targetAngle);
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
  const point = getCurrentPoint();
  const currentAngle = -point.angle || 0.0;
  if (targetAngle * (targetAngle - currentAngle) <= 0) {
    const {
      minPour = 0.0,
      maxPour = Infinity,
      epsHigh = 2e-3,
      epsLow = 1e-5,
      buffer = 0.03,
      overPour = true,
    } = options;
    const round = overPour ? 1 : -1;
    const dist = vMag(getCoord(point));
    let toOrigin = false;
    const _angleAtOrigin =
      -getCurrentPoint(computePlot(getRecipeItems().concat(createPourSolvent(dist)))).angle || 0.0;
    /** @type {number} */ var l;
    /** @type {number} */ var r;
    /** @type {number} */ var e;
    if (targetAngle * (targetAngle - _angleAtOrigin) <= 0) {
      // instructions.push(logAddPourSolvent(dist));
      l = dist + Math.abs(targetAngle - _angleAtOrigin) / 9.0 - buffer;
      r = dist + Math.abs(targetAngle - _angleAtOrigin) / 9.0 + buffer;
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
      const testAngle = -getCurrentPoint(plot).angle || 0.0;
      if (targetAngle * (targetAngle - testAngle) <= 0) {
        l = m;
      } else {
        r = m;
      }
    }
    return logAddPourSolvent(r, { shift: toOrigin ? 0 : round });
  }
  throw errorMsg("pourUntilAngle", "Cannot pour to larger or reversed angle.");
}

/**
 * Utility for angle conversions and vector-direction conversions.
 */

/** @type {(deg: number) => number} */
const degToRad = (deg) => (deg * Math.PI) / 180.0;
/** @type {(rad: number) => number} */
const radToDeg = (rad) => (rad * 180.0) / Math.PI;

/** @type {(deg: number) => {salt: "moon"|"sun", grains: number}} */
const degToSalt = (deg) => ({
  salt: deg > 0 ? "sun" : "moon",
  grains: (Math.abs(deg) * 500.0) / 180.0,
});

/** @type {(rad: number) => {salt: "moon"|"sun", grains: number}} */
const radToSalt = (rad) => ({
  salt: rad > 0 ? "sun" : "moon",
  grains: (Math.abs(rad) * 500.0) / Math.PI,
});

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
    throw errorMsg("converting salt to degree", "salt must be moon or sun.");
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
    throw errorMsg("converting salt to radian", "salt must be moon or sun.");
  }
}

/**
 * Calculates the unit vector for the given 2D vector (x, y).
 * @param {{x: number, y: number}} v The 2D vector.
 * @returns {{x: number, y: number}} The unit vector with components x and y.
 */
function unitV(v) {
  const mag = vMag(v);
  if (mag < Eps) {
    throw errorMsg("getting unit", "zero vector given.");
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
 * @param {{x: number, y: number}} v The 2D vector
 * @param {number} [baseDirection=0.0] The base direction angle in radians from which
 *   the vector's direction is calculated
 * @returns {number} The angle of the vector in radians, relative to the base direction
 */
function vecToDir(v, baseDirection = 0.0) {
  const unit = unitV(v);
  const rel = vRot(unit, baseDirection);
  let dir = Math.acos(rel.y);
  return rel.x < 0 ? -dir : dir;
}
/** @type {(x: number, y: number, baseDirection?: number) => number} */
const vecToDirCoord = (x, y, baseDirection = 0.0) => vecToDir({ x, y }, baseDirection);

/**
 * Utilities to retrieve useful information.
 */

/**
 * Computes the direction angle of the current bottle position.
 * @returns {number} The direction angle in radians.
 */
function getAngleOrigin() {
  let { x, y } = getCoord();
  if (x == 0.0 && y == 0.0) {
    throw errorMsg("getting bottle polar angle", "bottle at origin.");
  }
  return vecToDirCoord(x, y);
}

/**
 * Computes the direction angle of the current bottle position relative to the given entity.
 * @param {string[]} entityTypes A list of entity types to be considered.
 * @returns {number} The direction angle in radians.
 */
function getAngleEntity(entityTypes = Entity.Vortex) {
  const point = getCurrentPoint();
  const pC = getCoord(point);
  /** @type {{x: number, y: number}|undefined} */
  const eC = getEntityCoord(point.bottleCollisions.find(isEntityType(entityTypes)));
  if (eC === undefined) {
    throw errorMsg("getting bottle polar angle by entity", "given entity not found.");
  }
  let delta = vSub(pC, eC);
  return vecToDir(delta);
}
const getAngleVortex = () => getAngleEntity();
const getAngleEffect = () => getAngleEntity(Entity.PotionEffect);

/**
 * Compute the direction of stirring at current point.
 * @returns {number} The direction angle in radians.
 */
function getStirDirection() {
  const cp = getCurrentPoint();
  const pps = getPlot().pendingPoints;
  const { nextIndex: j, endPath } = getNextSegment(cp, pps, 0);
  if (endPath) {
    throw errorMsg("getting current stir direction", "no next node.");
  }
  return vecToDir(vSub(getCoord(pps[j]), getCoord(cp)));
}

/**
 * Compute the direction of heating a vortex at current point.
 * @returns {number} The direction angle in radians.
 */
function getHeatDirection() {
  const point = getCurrentPoint();
  const vC = getEntityCoord(point.bottleCollisions.find(isVortex));
  if (vC == undefined) {
    throw errorMsg("getting current heat direction", "no vortex at current position.");
  }
  const c = 1 / (2 * Math.PI);
  const pC = getCoord(point);
  const dist = vMag(vSub(vC, pC));
  const rot = Math.atan(c / dist);
  return vecToDir(vRot(vSub(pC, vC), -Math.PI / 2 - rot));
}

/**
 * Compute a direction from the initial point that tangents to the potion path.
 * @param {number} minStir - The minimum stir length before the tangent point.
 * @returns {{stir: number, direction: number}} - The stir length and the direction.
 */
function getTangent(minStir) {
  const pc0 = getCoord();
  const plot = computePlot(getRecipeItems().concat(createStirCauldron(minStir)));
  const pps = plot.pendingPoints;
  let cp = getCurrentPoint(plot);
  let i = 0;
  let stir = minStir;
  let rd;
  let initilized = false;
  while (true) {
    const { nextIndex: j, nextSegment, endPath } = getNextSegment(cp, pps, i);
    if (endPath) {
      throw errorMsg("getTangent", "No tangent found.");
    }
    stir += nextSegment;
    let pc1 = getCoord(cp);
    let pc2 = getCoord(pps[j]);
    if (!initilized) {
      initilized = true;
      const d = vecToDir(vSub(pc1, pc0));
      const ds = vecToDir(vSub(pc2, pc1));
      rd = relDir(ds, d);
    } else {
      const _d = vecToDir(vSub(pc1, pc0));
      const _ds = vecToDir(vSub(pc2, pc1));
      const _rd = relDir(_ds, _d);
      if (rd * _rd <= 0) {
        return { stir, direction: _d };
      }
      rd = _rd;
    }
    cp = pps[j];
    i = j;
  }
}

/**
 * Retrieves information about the target vortex at specified coordinates.
 * @param {number} x - The x-coordinate of the target vortex.
 * @param {number} y - The y-coordinate of the target vortex.
 * @returns {{x:number, y:number, r:number}} An object containing the x and y
 * coordinates and the radius of the target vortex.
 */
function getVortex(x, y) {
  const vortex = getEntityCoord(
    getCurrentPoint(computePlot([createSetPosition(x, y)])).bottleCollisions.find(isVortex)
  );
  if (vortex == undefined) {
    throw errorMsg("getting target vortex radius", "no vortex at target position.");
  }
  let small = getCurrentPoint(
    computePlot([createSetPosition(vortex.x + 1.8, vortex.y)])
  ).bottleCollisions.find(isVortex);
  if (small === undefined || small.x != vortex.x || small.y != vortex.y) {
    return { x: vortex.x, y: vortex.y, r: VortexRadiusSmall };
  }
  let medium = getCurrentPoint(
    computePlot([createSetPosition(vortex.x + 2.2, vortex.y)])
  ).bottleCollisions.find(isVortex);
  if (medium === undefined || medium.x != vortex.x || medium.y != vortex.y) {
    return { x: vortex.x, y: vortex.y, r: VortexRadiusMedium };
  }
  return { x: vortex.x, y: vortex.y, r: VortexRadiusLarge };
}
const getVortexC = (point = getCoord()) => getVortex(point.x, point.y);
const getVortexP = (point = getCurrentPoint()) => getVortexC(getCoord(point));

/**
 * Utilities to get the variable salt counter outside this file.
 */

const getSun = () => (Virtual ? VTotalSun : TotalSun);
const getMoon = () => (Virtual ? VTotalMoon : TotalMoon);
const getStir = () => (Virtual ? VTotalStir : TotalStir);
/**
 * Computes the total length of all stir-cauldron instructions in the given recipe items
 * @param {readonly import("@potionous/instructions").RecipeItem[]} recipeItems - the recipe items to compute the total stir length from
 * @returns {number} the total length of all stir-cauldron instructions in the given recipe items
 */
function getRecipeStir(recipeItems = getRecipeItems()) {
  let remainingPath = 0.0;
  let totalStir = 0.0;
  for (const item of recipeItems) {
    if (item.type == "add-ingredient") {
      /** @type {{grindPercent: number, ingredientId: import("@potionous/dataset").IngredientId}} */
      const { grindPercent, ingredientId } = item;
      remainingPath += Ingredients.get(ingredientId).computeLength(grindPercent);
    }
    if (item.type == "stir-cauldron") {
      /** @type {{distance: number}} */
      const { distance } = item;
      const stir = Math.min(distance, remainingPath);
      remainingPath -= stir;
      totalStir += stir;
    }
  }
  return totalStir;
}

/**
 * Computes the deviation from the target position and angle.
 * @param {{x: number, y: number, angle: number}} target - target position and angle.
 * @returns {{distance: number, angle: number, total: number}} An object containing the deviation from the target position and angle.
 */
function getDeviation(target) {
  const p = getCoord();
  const a = -getCurrentPoint().angle || 0.0;
  const distance = vMag(vSub(p, target)) * 1800.0;
  const angle = Math.abs(a - target.angle) / 12.0;
  return { distance, angle, total: distance + angle };
}

/**
 * Complex subroutines: straighten the potion path.
 */

/**
 * Straighten the potion path.
 * @param {number} direction The direction to be stirred in radian.
 * @param {"moon"|"sun"} salt The type of salt to be added. It must be "moon" or "sun".
 * @param {Object} [options] Options for the straightening process.
 * @param {number} [options.preStir=0] The amount of salt to be added before stirring.
 * @param {number} [options.maxStir=Infinity] The maximum distance to be stirred.
 * @param {number} [options.maxGrains=Infinity] The maximum amount of salt to be added.
 * @param {boolean} [options.ignoreReverse=true] If set to false, the function will terminate when a reversed direction is detected.
 * @param {boolean} [options.logAuxLine=false] If set to true, the function logs the auxiliary line of straightening to draw.
 */
function straighten(direction, salt, options = {}) {
  if (salt != "moon" && salt != "sun") {
    throw errorMsg("straightening", "salt must be moon or sun.");
  }
  const {
    preStir = 0,
    maxStir = Infinity,
    maxGrains = Infinity,
    ignoreReverse = true,
    logAuxLine = false,
  } = options;
  let _logAuxLine = logAuxLine; // log once.
  /** @type {import("@potionous/instructions").RecipeItem[]} */
  var instructions = [];
  let stirredLength = 0.0;
  let nextStir = 0.0;
  let totalGrains = 0;
  let plot = getPSPlot(preStir);
  let cp = getCurrentPoint(plot);
  let _preStir = preStir; // apply preStir once.
  let i = 0;
  while (true) {
    let pps = plot.pendingPoints;
    const { nextIndex: j, nextSegment, endPath } = getNextSegment(cp, pps, i);
    if (endPath) {
      // terminate by the end of path.
      instructions.push(logAddStirCauldron(Infinity));
      console.log("straighten terminated by end of path.");
      break;
    }
    const pc1 = getCoord(cp);
    const pc2 = getCoord(pps[j]);
    const rd = vecToDir(vSub(pc2, pc1), direction);
    let grains;
    if (salt == "moon") {
      if (rd < -SaltAngle / 2) {
        if (!ignoreReverse) {
          console.log("Detected reversed relative direction:" + rd);
          break;
        }
        grains = 0;
      } else {
        grains = Math.round(rd / SaltAngle);
      }
    } else {
      if (rd > SaltAngle / 2) {
        if (!ignoreReverse) {
          console.log("Detected reversed relative direction:" + rd);
          break;
        }
        grains = 0;
      } else {
        grains = Math.round(-rd / SaltAngle);
      }
    }
    if (grains > 0) {
      const instruction = logAddStirCauldron(nextStir + _preStir, { shift: 1 });
      nextStir = 0.0;
      if (_logAuxLine) {
        StraightenLines.push({ point: getCoord(), direction });
        _logAuxLine = false;
      }
      if (instruction.distance > 0) {
        stirredLength += instruction.distance - _preStir;
        _preStir = 0.0;
        instructions.push(instruction);
      }
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
        plot = getPlot();
        cp = getCurrentPoint();
        i = 0;
      }
    } else {
      nextStir += nextSegment;
      if (nextStir + stirredLength >= maxStir) {
        // capped stir length.
        nextStir = maxStir - stirredLength;
        instructions.push(logAddStirCauldron(nextStir + _preStir, { shift: -1 }));
        console.log("Straignten terminated by maximal length stirred.");
        break;
      }
      cp = pps[j];
      i = j;
    }
  }
  console.log(
    "Added " + totalGrains + " grains of " + salt + " salt in total while straightening."
  );
  return instructions;
}

/** main function. */
function main() {
  try {
    // Your Script here...
  } catch (e) {
    console.log(e);
  }
  printSalt();
  if (StraightenLines.length > 0) {
    drawAuxLine();
  }
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
  logAddSetRotation,
  // Zone detections.
  isVortex,
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
  getTangent,
  // Extraction of other informations.
  checkBase,
  getVortex,
  getDeviation,
  getCurrentPoint,
  getCoord,
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
  SaltNames,
  BaseNames,
  Effects,
};
