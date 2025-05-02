import { pointDistance } from "@potionous/common";

import {
  addIngredient,
  addSunSalt,
  addMoonSalt,
  addRotationSalt,
  addHeatVortex,
  addStirCauldron,
  addPourSolvent,
  createStirCauldron,
  createPourSolvent,
  addSetPosition,
} from "@potionous/instructions";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { startingPlot, currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

const SaltAngle = (2 * Math.PI) / 1000.0;
let Display = false; // Macro to switch instruction display.
let Step = 1;

/**
 * Logs the addition of an ingredient and adds it to the current plot.
 * @param {import("@potionous/dataset").IngredientId} ingredientId The ID of the ingredient to add.
 * @param {number} grindPercent The percentage of the ingredient to grind.
 * If `display` is not given, the value of `Display` is used.
 */
function logAddIngredient(ingredientId, grindPercent, display = Display) {
  if (display) {
    console.log("Step " + Step + ": Adding " + grindPercent * 100 + "% of " + ingredientId);
    Step += 1;
  }
  addIngredient(ingredientId, grindPercent);
}

/**
 * Logs the addition of sun salt and adds it to the current plot.
 * @param {number} grains The amount of sun salt to add in grains.
 * If `display` is not given, the value of `Display` is used.
 */
function logAddSunSalt(grains) {
  if (Display) {
    console.log("Step " + Step + ": Adding " + grains + " grains of sun salt");
    Step += 1;
  }
  addSunSalt(grains);
}

/**
 * Logs the addition of moon salt and adds it to the current plot.
 * @param {number} grains The amount of moon salt to add in grains.
 * If `display` is not given, the value of `Display` is used.
 */
function logAddMoonSalt(grains) {
  if (Display) {
    console.log("Step " + Step + ": Adding " + grains + " grains of moon salt");
    Step += 1;
  }
  addMoonSalt(grains);
}

/**
 * Logs the addition of rotation salt and adds it to the current plot.
 * @param {string} salt The type of rotation salt to add ("sun" or "moon").
 * @param {number} grains The amount of salt to add in grains.
 * If "display" is not given, the value of "Display" is used.
 */

function logAddRotationSalt(salt, grains) {
  if (salt != "moon" && salt != "sun") {
    console.log("Error while adding rotation salt: salt must be moon or sun.");
    throw EvalError;
  }
  if (Display) {
    console.log("Step " + Step + ": Adding " + grains + " grains of " + salt + " salt");
    Step += 1;
  }
  addRotationSalt(salt, grains);
}

/**
 * Logs the addition of heat to a vortex and adds it to the current plot.
 * @param {number} length The amount of heat to add to the vortex in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddHeatVortex(length) {
  if (Display) {
    console.log("Step " + Step + ": Heat the vortex by " + length + " distance.");
    Step += 1;
  }
  addHeatVortex(length);
}

/**
 * Logs the addition of a stir cauldron instruction and adds it to the current plot.
 * @param {number} length The amount of stirring to add in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddStirCauldron(length) {
  if (Display) {
    console.log("Step " + Step + ": Stir the cauldron by " + length + " distance.");
    Step += 1;
  }
  addStirCauldron(length);
}
/**
 * Logs the addition of a pour solvent instruction and adds it to the current plot.
 * @param {number} length The amount of solvent to pour in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddPourSolvent(length) {
  if (Display) {
    console.log("Step " + Step + ": Pour solvent by " + length + " distance");
    Step += 1;
  }
  addPourSolvent(length);
}

/**
 * Logs the addition of a set position instruction and adds it to the current plot.
 * @param {number} x The x coordinate to set
 * @param {number} y The y coordinate to set
 * If "display" is not given, the value of "Display" is used.
 */
function logAddSetPosition(x, y) {
  if (Display) {
    console.log("Step " + Step + ": teleporing to (" + x + ", " + y + ")");
    Step += 1;
  }
  addSetPosition(x, y);
}

/**
 * Checks if the given point is a danger zone.
 * @param {import("@potionous/dataset").PotionBaseEntity} x A point with an entityType property.
 * @returns {boolean} True if the entity type is a danger zone, false otherwise.
 */
function isDangerZone(x) {
  const { entityType } = x;
  return ["StrongDangerZonePart", "WeakDangerZonePart", "DangerZonePart"].includes(entityType);
}

/**
 * Checks if the given point is a Vortex.
 * @param {import("@potionous/dataset").PotionBaseEntity} x A point with an entityType property.
 * @returns {boolean} True if the entity type is a Vortex, false otherwise.
 */
function isVortex(x) {
  const { entityType } = x;
  return ["Vortex"].includes(entityType);
}

/**
 * Stirs the potion into a vortex by determining the optimal stirring
 * length required to reach the vortex edge and adding a stir instruction.
 *
 * This function checks if the current plot's pending points are sufficient
 * and ensures the bottle is not already within a vortex before proceeding
 * to compute the stir length. If a vortex is encountered during the process,
 * it calculates the precise stir length needed to approach the vortex edge
 * using binary search and adds this instruction to the recipe.
 *
 * @throws {EvalError} If there are insufficient points, the bottle is
 * already in a vortex, or no vortex is found during the process.
 */
function stirIntoVortex() {
  const pendingPoints = currentPlot.pendingPoints;
  if (pendingPoints.length < 3) {
    console.log("Error while stirring into vortex: not enough points.");
    throw EvalError;
  }
  const currentPoint = pendingPoints[0];
  const entities = currentPoint.bottleCollisions;
  const result = entities.find(isVortex);
  if (result != undefined) {
    console.log("Error while stirring into vortex: bottle in a vortex.");
    throw EvalError;
  }
  let stirLength = 0.0;
  let i;
  for (i = 2; i < pendingPoints.length; i++) {
    const currentPoint = pendingPoints[i];
    const entities = currentPoint.bottleCollisions;
    if (!entities.some(isVortex)) {
      stirLength += pointDistance(pendingPoints[i - 1], pendingPoints[i]);
    } else {
      break;
    }
  }
  if (i == pendingPoints.length) {
    console.log("Error while stirring into vortex: no vortex found.");
    throw EvalError;
  }
  let left = stirLength;
  let right = stirLength + pointDistance(pendingPoints[i - 1], pendingPoints[i]);
  while (right - left > 0.0001) {
    const mid = left + (right - left) / 2;
    const plot = computePlot(currentRecipeItems.concat([createStirCauldron(mid)]));
    const entities = plot.pendingPoints[0].bottleCollisions;
    if (entities.some(isVortex)) {
      left = mid;
    } else {
      right = mid;
    }
  }
  logAddStirCauldron(right);
}

/**
 * Computes the length of the stir from the current point to the edge of a vortex
 * that the bottle is currently in, and adds a stir instruction to the recipe for
 * this length.
 *
 * This function attempts to stir until the bottle is about to leave the same
 * vortex. If the current point is not within a vortex, an error is thrown.
 *
 * @throws {EvalError} If the operation is attempted outside of a vortex.
 */
function stirToEdge() {
  const pendingPoints = currentPlot.pendingPoints;
  const result = pendingPoints[0].bottleCollisions.find(isVortex);
  let vortexX;
  let vortexY;
  let stirLength = 0.0;
  if (result === undefined) {
    console.log("Error while stirring to edge: bottle not in a vortex.");
    throw EvalError;
  } else {
    vortexX = result.x;
    vortexY = result.y;
  }
  let pendingNPoint = pendingPoints.length;
  if (pendingNPoint <= 2) {
    console.log("Error while stirring to edge: not enough pending points.");
    throw EvalError;
  }
  let i;
  /**
   * Currently pendingPoints always have 1 or at least 3 elements.
   * If it has at least 3 elements, the first 2 are always same, i.e. the current point.
   */
  for (i = 2; i != pendingNPoint; i++) {
    let isSameVortex = true;
    const result = pendingPoints[i].bottleCollisions.find(isVortex);
    if (result === undefined) {
      isSameVortex = false;
    } else {
      if (result.x != vortexX || result.y != vortexY) {
        isSameVortex = false;
      }
    }
    if (!isSameVortex) {
      break;
    } else {
      stirLength += pointDistance(pendingPoints[i - 1], pendingPoints[i]);
    }
  }
  if (i == pendingNPoint) {
    console.log("Error while stirring to edge: bottle is in a vortex, but no edge found.");
    throw EvalError;
  }
  let left = stirLength;
  let right = stirLength + pointDistance(pendingPoints[i - 1], pendingPoints[i]);
  while (right - left > 0.0001) {
    const mid = left + (right - left) / 2;
    const plot = computePlot(currentRecipeItems.concat(createStirCauldron(mid)));
    const result = plot.pendingPoints[0].bottleCollisions.find(isVortex);
    let isSameVortex = true;
    if (result === undefined) {
      isSameVortex = false;
    } else {
      if (result.x != vortexX || result.y != vortexY) {
        isSameVortex = false;
      }
    }
    if (isSameVortex) {
      left = mid;
    } else {
      right = mid;
    }
  }
  logAddStirCauldron(left);
}

/**
 * Pours solvent to the edge of a vortex.
 *
 * This function attempts to pour solvent until the bottle is about to leave the same vortex.
 * If the current point is not within a vortex, an error is thrown.
 *
 * @throws {EvalError} If the operation is attempted outside of a vortex.
 */
function pourToEdge() {
  const pendingPoints = currentPlot.pendingPoints;
  let currentPoint = pendingPoints[0];
  const entities = currentPoint.bottleCollisions;
  const result = entities.find(isVortex);
  if (result === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    throw EvalError;
  } // In case this is called outside a vortex.
  const vortexX = result.x;
  const vortexY = result.y;

  let left = 0.0; // If we do not pour solvent the bottle should be in a vortex.
  let right = 5.0; // At least 5 pouring can pull the bottle out of the same vortex.
  let mid;
  let isSameVortex;
  while (right - left > 0.0001) {
    mid = left + (right - left) / 2;
    const plot = computePlot(currentRecipeItems.concat([createPourSolvent(mid)]));
    const pendingPoints = plot.pendingPoints;
    const currentPoint = pendingPoints[0];
    const entities = currentPoint.bottleCollisions;
    isSameVortex = true;
    const result = entities.find(isVortex);
    if (result === undefined) {
      isSameVortex = false;
    } else {
      if (result.x != vortexX || result.y != vortexY) {
        isSameVortex = false;
      }
    }
    if (isSameVortex) {
      left = mid;
    } else {
      right = mid;
    }
  }
  logAddPourSolvent(left);
}

/**
 * Continuously pours solvent to approach the edge of a vortex.
 *
 * This function attempts to pour solvent in multiple steps to move closer to the edge
 * of a vortex while adjusting the pouring length at each step based on a decay factor.
 * If the current point is not within a vortex, an error is thrown.
 *
 * @param {number} initialLength - The initial length of solvent to pour in each step.
 * @param {number} lengthDecay - The factor by which the length of pouring decreases in each step.
 * @param {number} numberEdgings - The number of times to edge closer to the vortex.
 * @param {number} [vortexRadius=2.39] - The radius of the vortex; used to compute the maximum pouring length.
 * @throws {EvalError} If the operation is attempted outside of a vortex.
 */

function continuousPourToEdge(initialLength, lengthDecay, numberEdgings, vortexRadius = 2.39) {
  const pendingPoints = currentPlot.pendingPoints;
  const result = pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    throw EvalError;
  }
  const vortexX = result.x;
  const vortexY = result.y;
  let i;
  let _length = initialLength;
  for (i = 0; i < numberEdgings; i++) {
    _length = _length * lengthDecay;
    const pendingPoints = currentPlot.pendingPoints;
    const x = pendingPoints[0].x;
    const y = pendingPoints[0].y;
    const vortexAngle = getAngleByDirection(-x, -y, getAngleByDirection(vortexX - x, vortexY - y));
    const maxLength = vortexRadius * (vortexAngle - Math.PI / 2) * 0.33;
    if (_length > maxLength) {
      _length = maxLength;
    }
    logAddHeatVortex(_length);
    pourToEdge();
  }
}

/**
 * Adjusts the potion's angle to the target angle by using solvents.
 *
 * This function attempts to bring the potion's current angle closer to the
 * specified target angle. It checks if the potion is either at the origin
 * or in a vortex and performs the derotation by adding solvents. If the
 * potion is neither at the origin nor in a vortex, an error is thrown.
 *
 * @param {number} targetAngle The target angle in degrees to derotate to.
 * @throws {EvalError} If the potion is outside the origin or vortex, or
 *                     if the target angle cannot be achieved from the
 *                     current angle.
 */

function derotateToAngle(targetAngle) {
  const pendingPoints = currentPlot.pendingPoints;
  const x = pendingPoints[0].x || 0.0;
  const y = pendingPoints[0].y || 0.0;
  let derotateType = "none";
  if (x == 0.0 || y == 0.0) {
    derotateType = "origin";
  } else {
    const result = pendingPoints[0].bottleCollisions.find(isVortex);
    if (result != undefined) {
      derotateType = "vortex";
    }
  }
  if (derotateType == "none") {
    console.log("Error while derotating: Cannot derotate outside origin or vortex.");
    throw EvalError;
  } else {
    const currentAngle = -pendingPoints[0].angle;
    if (currentAngle * targetAngle >= 0 && Math.abs(currentAngle) >= Math.abs(targetAngle)) {
      if (derotateType == "vortex") {
        logAddSetPosition(0, 0);
      }
      let left = 0.0;
      let right = 100.0;
      while (right - left > 0.0001) {
        const mid = left + (right - left) / 2;
        const plot = computePlot(currentRecipeItems.concat(createPourSolvent(mid)));
        const angle = -plot.pendingPoints[0].angle;
        if (Math.abs(angle) > targetAngle) {
          left = mid;
        } else {
          right = mid;
        }
      }
      logAddPourSolvent(left + (right - left) / 2);
      if (derotateType == "vortex") {
        logAddSetPosition(x, y);
      }
    } else {
      console.log("Error while derotating: Cannot derotate to larger or reversed angle.");
      throw EvalError;
    }
  }
}

/**
 * Converts degrees to radians.
 * @param {number} deg The degrees to convert
 * @returns {number} The radians equivalent of the given degrees
 */
function degToRad(deg) {
  return (deg * Math.PI) / 180.0;
}

/**
 * Converts radians to degrees.
 * @param {number} rad The radians to convert
 * @returns {number} The degrees equivalent of the given radians
 */
function radToDeg(rad) {
  return (rad * 180.0) / Math.PI;
}

/**
 * Converts degrees to salt.
 * @param {number} deg The degrees to convert
 */

function degToSalt(deg) {
  let salt;
  if (deg > 0) {
    salt = "sun";
  } else {
    salt = "moon";
  }
  const grains = (Math.abs(deg) * 500.0) / 180.0;
  return [salt, grains];
}

/**
 * Converts radians to salt.
 * @param {number} rad The radians to convert
 */
function radToSalt(rad) {
  let salt;
  if (rad > 0) {
    salt = "sun";
  } else {
    salt = "moon";
  }
  const grains = (Math.abs(rad) * 500.0) / Math.PI;
  return [salt, grains];
}

/**
 * Converts salt to degree.
 * @param {string} salt The salt type ("moon" or "sun")
 * @param {number} grains The number of grains of salt
 * @returns {number} The degree equivalent of the given salt and grains
 * @throws {Error} If the salt is not "moon" or "sun"
 */
function saltToDeg(salt, grains) {
  if (salt == "moon") {
    return (-grains * 180.0) / 500.0;
  } else if (salt == "sun") {
    return (grains * 180.0) / 500.0;
  } else {
    console.log("Error while converting salt to degree: salt must be moon or sun.");
    throw EvalError;
  }
}

/**
 * Converts salt to radian.
 * @param {string} salt The salt type ("moon" or "sun")
 * @param {number} grains The number of grains of salt
 * @returns {number} The radian equivalent of the given salt and grains
 * @throws {Error} If the salt is not "moon" or "sun"
 */
function saltToRad(salt, grains) {
  if (salt == "moon") {
    return (-grains * Math.PI) / 500.0;
  } else if (salt == "sun") {
    return (grains * Math.PI) / 500.0;
  } else {
    console.log("Error while converting salt to radian: salt must be moon or sun.");
    throw EvalError;
  }
}

/**
 * @param {number} angle positive for clock-wise.
 * @param {number} baseAngle 0 for top.
 */
function getDirectionByAngle(angle, baseAngle = 0.0) {
  let x = Math.sin(baseAngle + angle);
  let y = Math.cos(baseAngle + angle);
  return [x, y];
}

/**
 * Computes the unit vector of a 2D vector.
 * @param {number} x The x component of the vector
 * @param {number} y The y component of the vector
 * @returns {Array.<number>} The unit vector of the given vector
 * @throws {Error} If the vector is a zero vector
 */
function getUnit(x, y) {
  if (Math.abs(x) < 1e-6 && Math.abs(y) < 1e-6) {
    console.log("Error while getting unit: zero vector.");
    throw EvalError;
  } else {
    return [x / Math.sqrt(x ** 2 + y ** 2), y / Math.sqrt(x ** 2 + y ** 2)];
  }
}

/**
 * Computes the angle of a 2D vector given its x and y components.
 *
 * If no baseAngle is given, a value of 0.0 is used.
 *
 * @param {number} x The x component of the vector
 * @param {number} y The y component of the vector
 * @param {number} baseAngle The angle that is treated as up (0 degrees)
 * @returns {number} The angle of the vector in radians
 * @throws {Error} If the vector is a zero vector
 */
function getAngleByDirection(x, y, baseAngle = 0.0) {
  const _xy = getUnit(x, y);
  const _x = _xy[0];
  const _y = _xy[1];
  const relX = _x * Math.cos(baseAngle) - _y * Math.sin(baseAngle);
  const relY = _y * Math.cos(baseAngle) + _x * Math.sin(baseAngle);
  let angle = Math.asin(relX);
  if (relY < 0) {
    if (angle >= 0) {
      angle = Math.PI - angle;
    } else {
      angle = -Math.PI - angle;
    }
  }
  return angle;
}

/**
 * Computes the angle of the current stir in radians.
 *
 * @returns {number} The angle of the current stir in radians
 * @throws {Error} If the bottle is not in a stir
 */
function getCurrentStirAngle() {
  /** the points have no coordinate at origin */
  if (currentPlot.pendingPoints.length < 3) {
    console.log("Error while getting current stir angle: not enough points.");
    throw EvalError;
  }
  const fromX = currentPlot.pendingPoints[1].x || 0.0;
  const fromY = currentPlot.pendingPoints[1].y || 0.0;
  const toX = currentPlot.pendingPoints[2].x;
  const toY = currentPlot.pendingPoints[2].y;
  return getAngleByDirection(toX - fromX, toY - fromY);
}

/**
 * Straightens the potion path by adjusting the stirring direction using rotation salt.
 *
 * This function iteratively adjusts the stirring direction of the potion based on the specified
 * parameters. It attempts to straighten the path up to a specified maximum distance using either
 * "moon" or "sun" salt, while considering the maximum allowed grains of salt and whether to ignore
 * reverse directions.
 *
 * @param {number} maxStirDistance - The maximum distance to stir in PotionCraft units.
 * @param {number} direction - The initial direction in radians to align the stirring.
 * @param {string} [salt="moon"] - The type of rotation salt to use ("moon" or "sun").
 * @param {number} [maxGrains=999999] - The maximum grains of salt that can be used.
 * @param {boolean} [ignoreReverse=true] - Whether to ignore reverse directions.
 * @throws {EvalError} If the salt is neither "moon" nor "sun".
 */
function straighten(
  maxStirDistance,
  direction,
  salt = "moon",
  maxGrains = 999999,
  ignoreReverse = true
) {
  if (salt != "moon" && salt != "sun") {
    console.log("Error while straightening: salt must be moon or sun.");
    throw EvalError;
  }
  let distanceStirred = 0.0;
  let nextDistance = 0.0;
  let totalGrains = 0;
  let i = 1;
  let pendingPoints = currentPlot.pendingPoints;
  while (true) {
    const currentX = pendingPoints[i].x;
    const currentY = pendingPoints[i].y;
    const nextX = pendingPoints[i + 1].x;
    const nextY = pendingPoints[i + 1].y;
    const nextDirection = getAngleByDirection(nextX - currentX, nextY - currentY, direction);
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
      /**
       * 0.0001 is here to avoid zero vector error.
       * Or the potion may stop just before some node and cause zero vector error.
       */
      if (nextDistance > 0.0) {
        logAddStirCauldron(nextDistance + 0.0001);
        distanceStirred += nextDistance + 0.0001;
      }
      i = 1;
      nextDistance = 0.0;
      if (totalGrains + grains >= maxGrains) {
        /** If the salt is capped, then straightening should terminate. */
        grains = maxGrains - totalGrains;
        totalGrains += grains;
        logAddRotationSalt(salt, grains);
        console.log("Straignten terminated by maximal grains of salt added.");
        break;
      } else {
        totalGrains += grains;
        logAddRotationSalt(salt, grains);
        /** Calculate the new plotter after stir and salt. */
        pendingPoints = currentPlot.pendingPoints;
      }
    } else {
      nextDistance += pointDistance(pendingPoints[i], pendingPoints[i + 1]);
      // console.log(nextDistance)
      if (nextDistance + distanceStirred >= maxStirDistance) {
        /** If the distance is capped, stir the remaining path and terminate. */
        nextDistance = maxStirDistance - distanceStirred;
        logAddStirCauldron(nextDistance);
        console.log("Straignten terminated by maximal length stirred.");
        break;
      } else {
        i = i + 1;
        if (pendingPoints.length < i + 2) {
          console.log("Straignten terminated by end of path.");
          logAddStirCauldron(nextDistance);
          break;
        }
      }
    }
  }
  console.log("Total grains:" + totalGrains);
}

function main43MoonSwiftness() {
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(14.4);
  logAddPourSolvent(100);
  console.log("Current stir angle: " + radToDeg(getCurrentStirAngle()));
  logAddStirCauldron(3.8);
  let currentStirAngle = getCurrentStirAngle();
  console.log("Current stir angle: " + radToDeg(currentStirAngle));
  // straighten(10, getAngleByDirection(-5.49,5.76), "moon", 43)
  straighten(10, currentStirAngle, "moon", 43);
}

function mainUnrollingGoldthorn() {
  logAddIngredient(Ingredients.Goldthorn, 1);
  logAddStirCauldron(0.1);
  console.log("Current stir angle: " + radToDeg(getCurrentStirAngle()));
  let currntStirAngle = getCurrentStirAngle();
  straighten(30, currntStirAngle, "sun", 9999);
}

function mainUnrollingRainbowCap() {
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(0.4);
  console.log("Current stir angle: " + radToDeg(getCurrentStirAngle()));
  let currntStirAngle = getCurrentStirAngle();
  straighten(50, degToRad(-90), "moon", 9999);
}

function mainStirToEdgeTest() {
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddSetPosition(-5, 5);
  stirToEdge();
}

function mainAntiMagic() {
  logAddSunSalt(29);
  logAddSunSalt(138);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg("sun", 29));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(3, degToRad(17.6), "sun", 9999, true);
  logAddStirCauldron(6);
  let direction = getAngleByDirection(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y
  );
  logAddSunSalt(37);
  logAddStirCauldron(3.3);
  straighten(Infinity, direction + degToRad(0.0), "sun", 400, false);
  straighten(Infinity, direction + degToRad(0.0), "moon", 20, true);
  stirIntoVortex();
  continuousPourToEdge(0.2, 1, 12);
  logAddHeatVortex(2.7);
  straighten(4, degToRad(11.6), "sun", 208, true);
  logAddStirCauldron(0.78);
  logAddSunSalt(1);
  logAddStirCauldron(3.758);
}

try {
  Display = true;
  mainAntiMagic();
  // mainStirToEdgeTest()
  // mainUnrollingRainbowCap()
} catch (e) {
  console.log(e);
}
