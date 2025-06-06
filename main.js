import { pointDistance } from "@potionous/common";

import {
  addIngredient,
  addSunSalt,
  addMoonSalt,
  addRotationSalt,
  addHeatVortex,
  addStirCauldron,
  addPourSolvent,
  addSetPosition,
  createPourSolvent,
  createStirCauldron,
  // createSetPosition,
} from "@potionous/instructions";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

const LuckyInfinity = 1437;
const SaltAngle = (2 * Math.PI) / 1000.0; // angle per salt in radian.
const MinimalPour = 8e-3; // minimal pouring unit of current version of plotter. All pours are multiply of this.
const VortexRadiusLarge = 2.39;
const VortexRadiusMedium = 1.99;
const VortexRadiusSmall = 1.74;
const PourEpsilon = 2e-3; // precision for binary search of pouring length.
const DeviationT2 = 600.0;
const DeviationT3 = 100.0;
const DeviationT1 = 1.53 * 1800; // effect radius is 0.79, bottle radius is 0.74.
const EntityVortex = ["Vortex"];
const EntityPotionEffect = ["PotionEffect"];
const EntityDangerZone = ["DangerZonePart", "StrongDangerZonePart", "WeakDangerZonePart"];
const EntityStrongDangerZone = ["DangerZonePart", "StrongDangerZonePart"];
const Salt = { Moon: "moon", Sun: "sun" };
let Display = true; // Macro to switch instruction display.
let RoundStirring = true; // macro to control whether round stirrings.
let StirringUnit = 1e-3; // minimal stir unit of hand-added stirring instructions. Stirring instructions add by scripts can be infinitely precise.
let Step = 1;
let TotalSun = 0;
let TotalMoon = 0;
let ret = 0; // The return code of last function.
let err = ""; // The return into string of last error.

/**
 * Generally, functions named by "into" some entities move the bottle cross the boundary into it.
 * Functions named by "to" some entities stop the bottle just about to move into it.
 */

/**
 * Simulation of plotter API `createSetPosition(x, y)`.
 * @param {number} x
 * @param {number} y
 * @returns
 */
function createSetPosition(x, y) {
  return { type: "set-position", x: x, y: y };
}

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
 * Logs the error message if an error occurred during this script.
 * If no error occurred, it logs a success message.
 */
function logError() {
  if (ret) {
    console.log(err);
  } else {
    console.log("No error during this script!");
  }
}

/**
 * Sets the display flag to control instruction display.
 * @param {boolean} display - A boolean value to enable or disable instruction display.
 */
function setDisplay(display) {
  Display = display;
}

/**
 * Sets the stir rounding flag to control whether rounding the stir length.
 * @param {boolean} stirRounding - A boolean value to enable or disable rounding the stir length.
 */

function setStirRounding(stirRounding) {
  RoundStirring = stirRounding;
}

/**
 * Checks if the currentpotion base is the given expected base.
 * @param {"water"|"oil"|"wine"} expectedBase The expected base name.
 */
function checkBase(expectedBase) {
  if (ret) return;
  if (!["water", "oil", "wine"].includes(expectedBase)) {
    ret = 1;
    err = "Unknown expected base: " + expectedBase + ".";
    return;
  } else {
    const currentBase = PotionBases.current.id;
    if (currentBase != expectedBase) {
      ret = 1;
      err = "" + currentBase + " is not the expected base " + expectedBase + ".";
      return;
    }
  }
}

function logSalt() {
  if (ret) return;
  console.log("Total moon salt: " + TotalMoon + ", Total sun salt: " + TotalSun);
}

/**
 * Logging function to display the current step and the action taken.
 */

/**
 * Logs the addition of an ingredient and adds it to the current plot.
 * @param {import("@potionous/dataset").IngredientId} ingredientId The ID of the ingredient to add.
 * @param {number} [grindPercent=1.0] The percentage of the ingredient to grind, default to be 1.0.
 * If `display` is not given, the value of `Display` is used.
 */
function logAddIngredient(ingredientId, grindPercent = 1.0, display = Display) {
  if (ret) return;
  if (display) {
    console.log("Step " + Step + ": Adding " + grindPercent * 100 + "% of " + ingredientId);
    Step += 1;
  }
  addIngredient(ingredientId, grindPercent);
}

/**
 * Logs the addition of a Phantom Skirt ingredient and adds it to the current plot.
 * @param {number} [grindPercent=1.0] - The percentage of the Phantom Skirt to grind, default to 100%.
 * @param {boolean} [display=Display] - Whether to display the log message; defaults to the global Display setting.
 */
function logSkirt(grindPercent = 1.0, display = Display) {
  if (ret) return;
  if (display) {
    console.log("Step " + Step + ": Adding " + grindPercent * 100 + "% of skirt");
    Step += 1;
  }
  addIngredient(Ingredients.PhantomSkirt, grindPercent);
}

/**
 * Logs the addition of sun salt and adds it to the current plot.
 * @param {number} grains The amount of sun salt to add in grains.
 * @returns {number} The amount of sun salt added in grains.
 */

function logAddSunSalt(grains) {
  if (ret) return 0;
  if (grains <= 0) return 0;
  if (Display) {
    console.log("Step " + Step + ": Adding " + grains + " grains of sun salt");
    Step += 1;
  }
  TotalSun += grains;
  addSunSalt(grains);
  return grains;
}

/**
 * Logs the addition of moon salt and adds it to the current plot.
 * @param {number} grains The amount of moon salt to add in grains.
 */
function logAddMoonSalt(grains) {
  if (ret) return 0;
  if (grains <= 0) return 0;
  if (Display) {
    console.log("Step " + Step + ": Adding " + grains + " grains of moon salt");
    Step += 1;
  }
  TotalMoon += grains;
  addMoonSalt(grains);
  return grains;
}

/**
 * Logs the addition of rotation salt and adds it to the current plot.
 * @param {"moon"|"sun"} salt The type of rotation salt to add ("sun" or "moon").
 * @param {number} grains The amount of salt to add in grains.
 */
function logAddRotationSalt(salt, grains) {
  if (ret) return 0;
  if (salt != "moon" && salt != "sun") {
    ret = 1;
    err = "Error while adding rotation salt: salt must be moon or sun.";
    return;
  }
  if (grains <= 0) return 0;
  if (Display) {
    console.log("Step " + Step + ": Adding " + grains + " grains of " + salt + " salt");
    Step += 1;
  }
  if (salt == "moon") {
    TotalMoon += grains;
  } else {
    TotalSun += grains;
  }
  addRotationSalt(salt, grains);
  return grains;
}

/**
 * Logs the addition of heat to a vortex and adds it to the current plot.
 * @param {number} length The amount of heat to add to the vortex in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddHeatVortex(length) {
  if (ret) return;
  if (length <= 0) return;
  if (Display) {
    console.log("Step " + Step + ": Heat the vortex by " + length + " distance.");
    Step += 1;
  }
  addHeatVortex(Math.min(length, LuckyInfinity));
}

/**
 * Logs the addition of a stir cauldron instruction and adds it to the current plot.
 * @param {number} length The amount of stirring to add in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddStirCauldron(length) {
  if (ret) return;
  if (length <= 0) return;
  if (Display) {
    console.log("Step " + Step + ": Stir the cauldron by " + length + " distance.");
    Step += 1;
  }
  addStirCauldron(Math.min(length, LuckyInfinity));
  return;
}
/**
 * Logs the addition of a pour solvent instruction and adds it to the current plot.
 * @param {number} length The amount of solvent to pour in PotionCraft units.
 * If "display" is not given, the value of "Display" is used.
 */
function logAddPourSolvent(length) {
  if (ret) return;
  if (length <= 0) return;
  if (Display) {
    console.log("Step " + Step + ": Pour solvent by " + length + " distance");
    Step += 1;
  }
  addPourSolvent(Math.min(length, LuckyInfinity));
}

/**
 * Logs the addition of a set position instruction and adds it to the current plot.
 * @param {number} x The x coordinate to set
 * @param {number} y The y coordinate to set
 * If "display" is not given, the value of "Display" is used.
 */
function logAddSetPosition(x, y) {
  if (ret) return;
  if (Display) {
    console.log("Step " + Step + ": teleporting to (" + x + ", " + y + ")");
    Step += 1;
  }
  addSetPosition(x, y);
}

/**
 * Detection functions for different entity types.
 */

/**
 * Returns a function that checks if the bottle collides to one of the expected entity types.
 * @param {string[]} expectedEntityTypes The expected entity types.
 * @returns {(x: import("@potionous/dataset").PotionBaseEntity) => boolean} A function that takes a point and returns true if the point is one of the expected entity types, false otherwise.
 */
function isEntityType(expectedEntityTypes) {
  /**
   * @param {import("@potionous/dataset").PotionBaseEntity} x Checked entity.
   * @returns {boolean} True if the entity type is one of the expected types, false otherwise.
   */
  return (x) => expectedEntityTypes.includes(x.entityType);
}

const isDangerZone = isEntityType(EntityDangerZone);
const isStrongDangerZone = isEntityType(EntityStrongDangerZone);
const isVortex = isEntityType(EntityVortex);
const isPotionEffect = isEntityType(EntityPotionEffect);

/**
 * Subroutines related to stirring.
 */

/**
 * Stirs the solution into next vortex, adjusting the stir length based on
 * the current and target vortex positions.
 *
 * @param {number} [buffer=1e-5] - The buffer to adjust the final stir length.
 */
function stirIntoVortex(buffer = 1e-5) {
  if (ret) return;
  const pendingPoints = currentPlot.pendingPoints;
  const currentVortex = fixUndef(pendingPoints[0].bottleCollisions.find(isVortex));
  let currentStirLength = 0.0;
  let index = 0;
  let current = { x: pendingPoints[0].x || 0.0, y: pendingPoints[0].y || 0.0 };
  while (true) {
    index += 1;
    if (index == pendingPoints.length) {
      ret = 1;
      err = "Error while stirring into vortex: no vortex found.";
      return;
    }
    const nextVortex = fixUndef(pendingPoints[index].bottleCollisions.find(isVortex));
    if (
      nextVortex != undefined &&
      (currentVortex == undefined ||
        nextVortex.x != currentVortex.x ||
        nextVortex.y != currentVortex.y)
    ) {
      const next = { x: pendingPoints[index].x || 0.0, y: pendingPoints[index].y || 0.0 };
      const unit = getUnit(next.x - current.x, next.y - current.y);
      const l1 = unit.x * (nextVortex.x - current.x) + unit.y * (nextVortex.y - current.y);
      const l2 = -unit.y * (nextVortex.x - current.x) + unit.x * (nextVortex.y - current.y);
      const vortexRadius = getTargetVortexInfo(nextVortex.x, nextVortex.y).r;
      const approximatedLastStirLength = l1 - Math.sqrt(vortexRadius ** 2 - l2 ** 2);
      let finalStirLength = currentStirLength + approximatedLastStirLength;
      if (RoundStirring) {
        logAddStirCauldron(Math.ceil(finalStirLength / StirringUnit) * StirringUnit);
        return;
      }
      logAddStirCauldron(currentStirLength + approximatedLastStirLength + buffer);
      return;
    }
    currentStirLength += pointDistance(pendingPoints[index - 1], pendingPoints[index]);
    current = { x: pendingPoints[index].x || 0.0, y: pendingPoints[index].y || 0.0 };
  }
}

/**
 * Stirs the potion to the edge of the current vortex.
 * @param {number} [buffer=1e-5] - The buffer to adjust the final stir length.
 */
function stirToEdge(buffer = 1e-5) {
  if (ret) return;
  const pendingPoints = currentPlot.pendingPoints;
  const vortex = fixUndef(pendingPoints[0].bottleCollisions.find(isVortex));
  let stirLength = 0.0;
  if (vortex === undefined) {
    ret = 1;
    err = "Error while stirring to edge of vortex: bottle not in a vortex.";
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
        ret = 1;
        err = "Error while stirring to edge of vortex:Can not reach the edge of the vortex.";
        return;
      }
      stirLength += pointDistance(pendingPoints[index - 1], pendingPoints[index]);
    }
  }
  const current = { x: pendingPoints[index - 1].x || 0.0, y: pendingPoints[index - 1].y || 0.0 };
  const next = { x: pendingPoints[index].x || 0.0, y: pendingPoints[index].y || 0.0 };
  const unit = getUnit(next.x - current.x, next.y - current.y);
  const l1 = unit.x * (vortex.x - current.x) + unit.y * (vortex.y - current.y);
  const l2 = -unit.y * (vortex.x - current.x) + unit.x * (vortex.y - current.y);
  const vortexRadius = getTargetVortexInfo(vortex.x, vortex.y).r;
  const approximatedLastStirLength = l1 + Math.sqrt(vortexRadius ** 2 - l2 ** 2);
  const finalStirLength = stirLength + approximatedLastStirLength;
  if (RoundStirring) {
    logAddStirCauldron(Math.floor(finalStirLength / StirringUnit) * StirringUnit);
    return;
  }
  logAddStirCauldron(finalStirLength - buffer);
  return;
}

/**
 * Stirs the potion until a change in direction is detected or the maximum stir length is reached.
 */

/**
 * Stirs the potion until a change in direction is detected or the maximum
 * additional stir length is reached.
 *
 * @param {number} [minStirLength=0.0] - The minimum initial stir length.
 * @param {number} [maxExtraStirLength=Infinity] - The maximum additional stir length
 *     allowed beyond the initial length before stopping.
 * @param {number} [directionBuffer=20 * SaltAngle] - The buffer angle used to
 *     determine the change in direction.
 * @param {number} [leastSegmentLength=1e-7] - The minimum length between points
 *     to be considered for a direction change.
 */

function stirToTurn(
  minStirLength = 0.0,
  maxExtraStirLength = Infinity,
  directionBuffer = 20 * SaltAngle,
  leastSegmentLength = 1e-7
) {
  if (ret) return;
  const minCosine = Math.cos(directionBuffer);
  let pendingPoints = currentPlot.pendingPoints;
  if (minStirLength > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat([createStirCauldron(minStirLength)])
    ).pendingPoints;
  }
  let currentUnit = undefined;
  let currentIndex = 0;
  let nextIndex = currentIndex;
  let stirLength = 0.0;
  let nextStirSegmentLength = 0.0;
  while (true) {
    while (true) {
      nextIndex += 1;
      if (nextIndex >= pendingPoints.length) {
        ret = 1;
        err = "Error while stirring to turn: no turning point found.";
        return;
      } // Did not find a node that is not the current point.
      nextStirSegmentLength += pointDistance(
        pendingPoints[nextIndex - 1],
        pendingPoints[nextIndex]
      );
      if (nextStirSegmentLength > leastSegmentLength) {
        break;
      }
    }
    const nextUnit = getUnit(
      pendingPoints[nextIndex].x - pendingPoints[currentIndex].x,
      pendingPoints[nextIndex].y - pendingPoints[currentIndex].y
    );
    if (
      currentUnit != undefined &&
      currentUnit.x * nextUnit.x + currentUnit.y * nextUnit.y < minCosine
    ) {
      if (RoundStirring) {
        logAddStirCauldron(Math.floor((minStirLength + stirLength) / StirringUnit) * StirringUnit);
        return;
      }
      logAddStirCauldron(minStirLength + stirLength);
      return;
    } else {
      stirLength += nextStirSegmentLength;
      nextStirSegmentLength = 0.0;
      currentIndex = nextIndex;
      currentUnit = nextUnit;
      if (stirLength >= maxExtraStirLength) {
        if (RoundStirring) {
          logAddStirCauldron(
            Math.floor((minStirLength + maxExtraStirLength) / StirringUnit) * StirringUnit
          );
        }
        logAddStirCauldron(minStirLength + maxExtraStirLength);
        return;
      }
    }
    nextIndex = currentIndex;
  }
}

/**
 * Stirs the potion to the edge of the current or next danger zone.
 * @param {number} [minStirLength=0.0] - The minimum initial stir length.
 * @returns {number} The least health value encountered while stirring.
 */
function stirToDangerZoneExit(minStirLength = 0.0) {
  if (ret) return 1.0;
  let pendingPoints = currentPlot.pendingPoints;
  if (minStirLength > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat(createStirCauldron(minStirLength))
    ).pendingPoints;
  }
  let inDangerZone = false;
  if (pendingPoints[0].bottleCollisions.find(isDangerZone) != undefined) {
    inDangerZone = true;
  }
  let nextIndex = 0;
  let stirDistance = 0.0;
  let leastHealth = 1.0;
  while (true) {
    nextIndex += 1;
    if (nextIndex == pendingPoints.length) {
      ret = 1;
      err = "Error while stirring to safe zone: no safe zone found.";
      return 1.0;
    }
    stirDistance += pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
    const result = pendingPoints[nextIndex].bottleCollisions.find(isDangerZone);
    if (inDangerZone) {
      if (result === undefined) {
        break;
      }
      leastHealth = pendingPoints[nextIndex].health;
    } else {
      if (result != undefined) {
        inDangerZone = true;
      }
    }
  }
  if (RoundStirring) {
    stirDistance = Math.ceil(stirDistance / StirringUnit) * StirringUnit;
  }
  // calculation by plotter is accurate enough.
  logAddStirCauldron(minStirLength + stirDistance);
  return leastHealth;
}

/**
 * Stirs the potion towards the nearest point to the given target coordinates,
 * within the specified constraints on stir lengths.
 *
 * This stir is not rounded for precision.
 * @param {number} targetX - The x-coordinate of the target position.
 * @param {number} targetY - The y-coordinate of the target position.
 * @param {number} [minstirLength=0.0] - The minimum length to stir initially.
 * @param {number} [maxExtraStirLength=Infinity] - The maximum additional length
 *     allowed for stirring beyond the initial length.
 * @param {number} [leastSegmentLength=1e-7] - The minimum length between points
 *     to be considered in the calculation.
 * @returns {number} The optimal distance to the target after stirring.
 */
function stirToNearestTarget(
  targetX,
  targetY,
  minstirLength = 0.0,
  maxExtraStirLength = Infinity,
  leastSegmentLength = 1e-7
) {
  if (ret) return 0.0;
  let pendingPoints = currentPlot.pendingPoints;
  if (minstirLength > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat([createStirCauldron(minstirLength)])
    ).pendingPoints;
  }
  // const pendingPoints = currentPlot.pendingPoints;
  const initialX = pendingPoints[0].x || 0.0;
  const initialY = pendingPoints[0].y || 0.0;
  const initialDistance = Math.sqrt((initialX - targetX) ** 2 + (initialY - targetY) ** 2);
  let isLastSegment = false;
  let currentStirLength = 0.0;
  let optimalStirLength = 0.0;
  let optimalDistance = initialDistance;
  let currentIndex = 0;
  let nextIndex = currentIndex;
  let nextSegmentLength = 0.0;
  let currentX = initialX;
  let currentY = initialY;
  while (!isLastSegment) {
    while (true) {
      nextIndex += 1;
      if (nextIndex == pendingPoints.length) {
        isLastSegment = true;
        break;
      }
      nextSegmentLength += pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
      if (nextSegmentLength > leastSegmentLength) {
        break;
      }
    }
    if (nextSegmentLength <= leastSegmentLength) {
      continue;
    }
    if (currentStirLength + nextSegmentLength > maxExtraStirLength) {
      isLastSegment = true;
    }
    const nextX = pendingPoints[nextIndex].x || 0.0;
    const nextY = pendingPoints[nextIndex].y || 0.0;
    const nextUnit = getUnit(nextX - currentX, nextY - currentY);
    const lastStirLength = nextUnit.x * (targetX - currentX) + nextUnit.y * (targetY - currentY);
    if (lastStirLength > nextSegmentLength) {
      const nextDistance = Math.sqrt((targetX - nextX) ** 2 + (targetY - nextY) ** 2);
      if (nextDistance < optimalDistance) {
        optimalStirLength = currentStirLength + lastStirLength;
        optimalDistance = nextDistance;
      }
    } else {
      if (lastStirLength >= 0) {
        const lastOptimalDistance = Math.abs(
          -nextUnit.y * (targetX - currentX) + nextUnit.x * (targetY - currentY)
        );
        if (lastOptimalDistance < optimalDistance) {
          optimalDistance = lastOptimalDistance;
          optimalStirLength = currentStirLength + lastStirLength;
        }
      }
    }
    currentIndex = nextIndex;
    currentX = pendingPoints[currentIndex].x || 0.0;
    currentY = pendingPoints[currentIndex].y || 0.0;
    currentStirLength += nextSegmentLength;
    nextSegmentLength = 0.0;
  }
  logAddStirCauldron(minstirLength + optimalStirLength);
  return optimalDistance;
}

/**
 * Stirs the potion to the specified tier, adjusting the stir length based on
 * the current angle and position.
 *
 * This stir is not rounded for precision.
 * @param {number} targetX - The x-coordinate of the target.
 * @param {number} targetY - The y-coordinate of the target.
 * @param {number} targetAngle - The angle of the target.
 * @param {number} [minStirLength=0.0] - The minimum stir length to reach the
 *     target tier.
 * @param {number} [maxDeviation=DeviationT2] - The maximum angle deviation to
 *     the target.
 * @param {boolean} [ignoreAngle=false] - If true, the function will ignore angle
 *     deviation.
 * @param {number} [leastSegmentLength=1e-9] - The minimum length between points to
 *     consider in the optimization.
 * @param {number} [afterBuffer=1e-5] - The buffer to adjust the final stir
 *     length.
 */
function stirToTier(
  targetX,
  targetY,
  targetAngle,
  minStirLength = 0.0,
  maxDeviation = DeviationT2,
  ignoreAngle = false,
  leastSegmentLength = 1e-9,
  afterBuffer = 1e-5
) {
  if (ret) return;
  let pendingPoints = currentPlot.pendingPoints;
  if (minStirLength > 0.0) {
    pendingPoints = computePlot(
      currentRecipeItems.concat(createStirCauldron(minStirLength))
    ).pendingPoints;
  }
  const currentPoint = currentPlot.pendingPoints[0];
  const currentAngle = -currentPoint.angle || 0.0;
  const angleDelta = radToDeg(
    Math.abs(getRelativeDirection(degToRad(currentAngle), degToRad(targetAngle)))
  );
  let angleDeviation = angleDelta * (100.0 / 12.0);
  if (ignoreAngle) {
    angleDeviation = 0.0;
  }
  if (angleDeviation >= maxDeviation) {
    ret = 1;
    err = "Error while stir to tier: too much angle deviation.";
    return;
  }
  const requiredDistance = (maxDeviation - angleDeviation) / 1800.0;
  const initialX = currentPlot.pendingPoints[0].x || 0.0;
  const initialY = currentPlot.pendingPoints[0].y || 0.0;
  let lastSegment = false;
  let currentStirLength = 0.0;
  let currentSegmentLength = 0.0;
  let currentIndex = 0;
  let nextIndex = currentIndex;
  let currentX = initialX;
  let currentY = initialY;
  // assume the initial position do not reach the tier.
  let nextDistance = 0.0;
  while (!lastSegment) {
    while (true) {
      nextIndex += 1;
      if (nextIndex == pendingPoints.length) {
        lastSegment = true;
        break;
      }
      currentSegmentLength += pointDistance(pendingPoints[currentIndex], pendingPoints[nextIndex]);
      if (currentSegmentLength > leastSegmentLength) {
        break;
      }
    }
    if (currentSegmentLength <= leastSegmentLength) {
      continue;
    }
    const nextX = pendingPoints[nextIndex].x || 0.0;
    const nextY = pendingPoints[nextIndex].y || 0.0;
    const nextUnit = getUnit(nextX - currentX, nextY - currentY);
    nextDistance = Math.sqrt((targetX - nextX) ** 2 + (targetY - nextY) ** 2);
    let lastStirLength = nextUnit.x * (targetX - currentX) + nextUnit.y * (targetY - currentY);
    if (lastStirLength > currentSegmentLength) {
      if (nextDistance < requiredDistance) {
        const lineDistance = -nextUnit.y * (targetX - currentX) + nextUnit.x * (targetY - currentY);
        const approximatedLastStirLength =
          lastStirLength - Math.sqrt(requiredDistance ** 2 - lineDistance ** 2);
        logAddStirCauldron(
          minStirLength +
            currentStirLength +
            Math.min(approximatedLastStirLength + afterBuffer, currentSegmentLength)
        );
        return;
      }
    } else {
      if (lastStirLength >= 0) {
        const nextDistance = -nextUnit.y * (targetX - currentX) + nextUnit.x * (targetY - currentY);
        const approximatedLastStirLength =
          lastStirLength - Math.sqrt(requiredDistance ** 2 - nextDistance ** 2);
        if (nextDistance < requiredDistance) {
          logAddStirCauldron(
            minStirLength +
              currentStirLength +
              Math.min(approximatedLastStirLength + afterBuffer, lastStirLength)
          );
          return;
        }
      }
    }
    currentIndex = nextIndex;
    currentX = nextX;
    currentY = nextY;
    currentStirLength += currentSegmentLength;
    currentSegmentLength = 0.0;
  }
  ret = 1;
  err = "Error while stirring to tier: cannot reach target tier.";
  return;
}

/**
 * Stirs the potion to consume a specified length while in a vortex.
 * This is not affected by stir rounding, since the stir length is manually input.
 * @param {number} consumeLength - The length of stirring to consume.
 */
function stirToConsume(consumeLength) {
  if (ret) return;
  const currentPoint = currentPlot.pendingPoints[0];
  const result = currentPoint.bottleCollisions.find(isVortex);
  if (result == undefined) {
    ret = 1;
    err = "Error while stirring to consume: bottle not in a vortex.";
    return;
  }
  logAddStirCauldron(consumeLength);
  logAddSetPosition(currentPoint.x, currentPoint.y);
  return;
}

/**
 * Subroutines related to pouring solvent.
 */

/**
 * Pours solvent to the edge of the current vortex.
 */
function pourToEdge() {
  if (ret) return;
  const currentPoint = currentPlot.pendingPoints[0];
  const vortex = fixUndef(currentPoint.bottleCollisions.find(isVortex));
  if (vortex === undefined) {
    ret = 1;
    err = "Error while pouring to edge: bottle not in a vortex.";
    return;
  } // In case this is called outside a vortex.
  const vortexRadius = getCurrentVortexRadius();
  const pourUnit = getUnit(-currentPoint.x, -currentPoint.y);
  const l1 = pourUnit.x * (vortex.x - currentPoint.x) + pourUnit.y * (vortex.y - currentPoint.y);
  const l2 = -pourUnit.y * (vortex.x - currentPoint.x) + pourUnit.x * (vortex.y - currentPoint.y);
  const approximatedPourLength = Math.max(
    Math.floor((l1 + Math.sqrt(vortexRadius ** 2 - l2 ** 2)) / MinimalPour) * MinimalPour -
      MinimalPour / 2.0,
    0.0
  );
  const result = computePlot([
    createSetPosition(currentPoint.x, currentPoint.y),
    createPourSolvent(approximatedPourLength),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    logAddPourSolvent(approximatedPourLength - MinimalPour);
    return;
  }
  logAddPourSolvent(approximatedPourLength);
  return;
}

/**
 * Pours solvent into the target vortex.
 *
 * @param {number} targetVortexX - The x-coordinate of the target vortex.
 * @param {number} targetVortexY - The y-coordinate of the target vortex.
 */
function pourIntoVortex(targetVortexX, targetVortexY) {
  if (ret) return;
  const vortex = getTargetVortexInfo(targetVortexX, targetVortexY);
  const currentPoint = currentPlot.pendingPoints[0];
  const current = { x: currentPoint.x || 0.0, y: currentPoint.y || 0.0 };
  const pourUnit = getUnit(-current.x, -current.y);
  const l1 = pourUnit.x * (vortex.x - current.x) + pourUnit.y * (vortex.y - current.y);
  const l2 = -pourUnit.y * (vortex.x - current.x) + pourUnit.x * (vortex.y - current.y);
  if (Math.abs(l2) >= vortex.r) {
    ret = 1;
    err = "Error while pouring into target vortex: bottle polar angle deviates too much.";
    return;
  }
  const approximatedPourLength = l1 - Math.sqrt(vortex.r ** 2 - l2 ** 2);
  if (approximatedPourLength <= 0) {
    ret = 1;
    err = "Error while pouring into target vortex: bottle not behind the target vortex.";
    return;
  }
  const actualPourLength =
    Math.floor(approximatedPourLength / MinimalPour) * MinimalPour + MinimalPour / 2.0;
  logAddPourSolvent(actualPourLength);
  return;
}

/**
 * Heats and pours to the edge of the current vortex.
 *
 * @param {number} length - The maximum length of solvent to pour.
 * @param {number} repeats - The number of times to repeat the heating and pouring process.
 */
function heatAndPourToEdge(length, repeats) {
  if (ret) return;
  const vortex = fixUndef(currentPlot.pendingPoints[0].bottleCollisions.find(isVortex));
  if (vortex === undefined) {
    ret = 1;
    err = "Error while pouring to edge: bottle not in a vortex.";
    return;
  }
  const vortexRadius = getCurrentVortexRadius();
  const c = 0.17; // the coefficient of the archimedean spiral formed by the vortex.
  const vortexDistance = Math.sqrt(vortex.x ** 2 + vortex.y ** 2);
  const cosTheta = vortexRadius / vortexDistance;
  const sinTheta = Math.sqrt(vortexDistance ** 2 - vortexRadius ** 2) / vortexDistance;
  const vortexUnit = getUnit(-vortex.x, -vortex.y);
  const edgeLimit = {
    x: cosTheta * vortexUnit.x + sinTheta * vortexUnit.y,
    y: -sinTheta * vortexUnit.x + cosTheta * vortexUnit.y,
  };
  for (let i = 0; i < repeats; i++) {
    const pendingPoints = currentPlot.pendingPoints;
    const x = pendingPoints[0].x || 0.0;
    const y = pendingPoints[0].y || 0.0; // unnecessary since origin is not in a vortex.
    let maxLength = Infinity;
    if (edgeLimit.x * (x - vortex.x) + edgeLimit.y * (y - vortex.y) > 0) {
      maxLength = -edgeLimit.y * (x - vortex.x) + edgeLimit.x * (y - vortex.y);
      maxLength = maxLength - c;
      if (maxLength < 0) {
        break;
      }
      maxLength = maxLength * 0.75;
      maxLength = Math.floor(maxLength / MinimalPour) * MinimalPour + MinimalPour / 2.0;
    }
    logAddHeatVortex(Math.min(length, maxLength));
    pourToEdge();
  }
  return;
}

/**
 * Pours the solvent towards danger zone with precision.
 *
 * @param {number} maxPourLength - The maximum length of solvent to pour.
 */
function pourToDangerZone(maxPourLength) {
  if (ret) return;
  const initialResult = currentPlot.pendingPoints[0].bottleCollisions.find(isDangerZone);
  if (initialResult != undefined) {
    ret = 1;
    err = "Error while pouring to danger zone: already in danger zone.";
    return;
  }
  const initialCommittedIndex = Math.max(currentPlot.committedPoints.length - 1, 0);
  const initialX = currentPlot.pendingPoints[0].x || 0.0;
  const initialY = currentPlot.pendingPoints[0].y || 0.0;
  const plot = computePlot([
    createSetPosition(initialX, initialY),
    createPourSolvent(maxPourLength),
  ]);
  let nextIndex = 0;
  let pourLength = 0.0;
  while (true) {
    nextIndex += 1;
    if (nextIndex == plot.committedPoints.length) {
      ret = 1;
      err = "Error while pouring to danger zone: cannot reach danger zone.";
      return;
    }
    if (plot.committedPoints[nextIndex].bottleCollisions.find(isDangerZone) != undefined) {
      break;
    }
    pourLength = pointDistance(
      currentPlot.committedPoints[initialCommittedIndex],
      plot.committedPoints[nextIndex]
    );
  }
  pourLength = Math.max(
    Math.floor(pourLength / MinimalPour) * MinimalPour - MinimalPour / 2.0,
    0.0
  );
  logAddPourSolvent(pourLength);
  return;
}

/**
 * Derotates the bottle to a target angle.
 * Error if the bottle is not in a vortex or at the origin,
 * or if the derotation is impossible.
 *
 * @param {number} targetAngle - The target angle to derotate to, in degree.
 * @param {number} [buffer=0.012] - The buffer to adjust the initial pour length estimation.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 */
function derotateToAngle(targetAngle, buffer = 0.012, epsilon = PourEpsilon) {
  if (ret) return;
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
    ret = 1;
    err = "Error while derotating: Cannot derotate outside origin or vortex.";
    return;
  } else {
    const currentAngle = -pendingPoints[0].angle;
    // if (currentAngle * targetAngle >= 0 && Math.abs(currentAngle) >= Math.abs(targetAngle)) {
    if (targetAngle * (targetAngle - currentAngle) <= 0) {
      if (derotateType == "vortex") {
        logAddSetPosition(0, 0);
      }
      if (targetAngle == 0.0) {
        // Do not need precision for full derotation.
        logAddPourSolvent(Infinity);
      } else {
        const approximatedPour = Math.abs(currentAngle - targetAngle) / 9.0;
        let left = Math.max(approximatedPour - buffer, 0.0);
        let right = approximatedPour + buffer;
        while (right - left > epsilon) {
          const mid = left + (right - left) / 2;
          const plot = computePlot(currentRecipeItems.concat(createPourSolvent(mid)));
          const angle = -plot.pendingPoints[0].angle;
          if (Math.abs(angle) > Math.abs(targetAngle)) {
            left = mid;
          } else {
            right = mid;
          }
        }
        logAddPourSolvent(left + (right - left) / 2);
      }
      if (derotateType == "vortex") {
        logAddSetPosition(x, y);
      }
    } else {
      ret = 1;
      err = "Error while derotating: Cannot derotate to larger or reversed angle.";
      return;
    }
  }
  return;
}

/**
 * Utilities for angle conversion and direction calculation.
 */

/**
 * Converts degrees to radians.
 * @param {number} deg The degrees to convert
 * @returns {number} The radians equivalent of the given degrees
 */
function degToRad(deg) {
  if (ret) return 0.0;
  return (deg * Math.PI) / 180.0;
}

/**
 * Converts radians to degrees.
 * @param {number} rad The radians to convert
 * @returns {number} The degrees equivalent of the given radians
 */
function radToDeg(rad) {
  if (ret) return 0.0;
  return (rad * 180.0) / Math.PI;
}

/**
 * Converts degrees to salt.
 * @param {number} deg The degrees to convert
 * @returns {{salt: "moon"|"sun", grains: number}} The salt equivalent of the given degrees
 */
function degToSalt(deg) {
  if (ret) return { salt: "moon", grains: 0 };
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
  if (ret) return { salt: "moon", grains: 0 };
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
  if (ret) return 0.0;
  if (salt == "moon") {
    return (-grains * 180.0) / 500.0;
  } else if (salt == "sun") {
    return (grains * 180.0) / 500.0;
  } else {
    ret = 1;
    err = "Error while converting salt to degree: salt must be moon or sun.";
    return 0.0;
  }
}

/**
 * Converts salt to radian.
 * @param {"moon"|"sun"} salt The salt type ("moon" or "sun")
 * @param {number} grains The number of grains of salt
 * @returns {number} The radian equivalent of the given salt and grains
 * @throws {Error} If the salt is not "moon" or "sun"
 */
function saltToRad(salt, grains) {
  if (ret) return 0.0;
  if (salt == "moon") {
    return (-grains * Math.PI) / 500.0;
  } else if (salt == "sun") {
    return (grains * Math.PI) / 500.0;
  } else {
    ret = 1;
    err = "Error while converting salt to radian: salt must be moon or sun.";
    return 0.0;
  }
}

/**
 * Calculates the unit vector for the given 2D vector (x, y).
 *
 * @param {number} x The x-component of the vector.
 * @param {number} y The y-component of the vector.
 * @returns {{x: number, y: number}} The unit vector with components x and y.
 */
function getUnit(x, y) {
  if (ret) return { x: 0.0, y: 1.0 };
  if (Math.abs(x) < 1e-12 && Math.abs(y) < 1e-12) {
    ret = 1;
    err = "Error while getting unit: zero vector.";
    return { x: 0.0, y: 1.0 };
  } else {
    return { x: x / Math.sqrt(x ** 2 + y ** 2), y: y / Math.sqrt(x ** 2 + y ** 2) };
  }
}

/**
 * Computes a 2D vector from a direction angle and an optional base direction angle.
 * @param {number} direction The direction angle in radians
 * @param {number} [baseDirection=0.0] The base direction angle in radians
 * @returns {{x: number, y: number}} The 2D vector with components x and y
 */
function getVectorByDirection(direction, baseDirection = 0.0) {
  if (ret) return { x: 0.0, y: 1.0 };
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
function getRelativeDirection(direction, baseDirection) {
  if (ret) return 0.0;
  let relativeDirection = direction - baseDirection;
  relativeDirection -= 2 * Math.PI * Math.round(relativeDirection / (2 * Math.PI));
  return relativeDirection;
}

/**
 * Computes the direction angle of a 2D vector relative to a base direction.
 *
 * @param {number} x The x component of the vector
 * @param {number} y The y component of the vector
 * @param {number} [baseDirection=0.0] The base direction angle in radians from which
 *   the vector's direction is calculated
 * @returns {number} The angle of the vector in radians, relative to the base direction
 */
function getDirectionByVector(x, y, baseDirection = 0.0) {
  if (ret) return 0.0;
  const unit = getUnit(x, y);
  const relX = unit.x * Math.cos(baseDirection) - unit.y * Math.sin(baseDirection);
  const relY = unit.y * Math.cos(baseDirection) + unit.x * Math.sin(baseDirection);
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
 * Computes the direction angle of the current bottle position.
 *
 * @param {boolean} [toBottle=true] - If true, calculates the direction from the current position to the origin.
 *                              If false, calculates the direction from the origin to the current position.
 * @returns {number} The direction angle in radians.
 */
function getBottlePolarAngle(toBottle = true) {
  if (ret) return 0.0;
  const currentPoint = currentPlot.pendingPoints[0];
  let x = currentPoint.x || 0.0;
  let y = currentPoint.y || 0.0;
  if (x == 0.0 && y == 0.0) {
    ret = 1;
    err = "Error while getting bottle polar angle: bottle at origin.";
    return 0.0;
  }
  if (!toBottle) {
    x = -x;
    y = -y;
  }
  return getDirectionByVector(x, y);
}

/**
 * Computes the direction angle of the current bottle position relative to the given entity.
 *
 * @param {string[]} expectedEntityTypes A list of entity types to be considered. The function will return the direction to the first found entity.
 * @param {boolean} [toBottle=true] - If true, calculates the direction from the current position to the entity.
 *                              If false, calculates the direction from the entity to the current position.
 * @returns {number} The direction angle in radians.
 * @throws {Error} If the given entity is not found or the bottle coincides the entity.
 */
function getBottlePolarAngleByEntity(expectedEntityTypes = EntityVortex, toBottle = true) {
  if (ret) return 0.0;
  const currentPoint = currentPlot.pendingPoints[0];
  let entity = undefined;
  // online plotter do not support for-of statement.
  for (let i = 0; i < expectedEntityTypes.length; i++) {
    entity = fixUndef(
      currentPoint.bottleCollisions.find((x) => x.entityType === expectedEntityTypes[i])
    );
    if (entity !== undefined) break;
  }
  if (entity === undefined) {
    ret = 1;
    err = "Error while getting bottle polar angle by entity: given entity not found.";
    return 0.0;
  }
  let delta = { x: (currentPoint.x || 0.0) - entity.x, y: (currentPoint.y || 0.0) - entity.y };
  if (Math.abs(delta.x) < 1e-9 && Math.abs(delta.y) < 1e-9) {
    ret = 1;
    err = "Error while getting bottle polar angle by entity: bottle coincides the entity.";
    return 0.0;
  }
  if (!toBottle) {
    delta.x = -delta.x;
    delta.y = -delta.y;
  }
  return getDirectionByVector(delta.x, delta.y);
}

/**
 * Computes the angle of the current stir in radians.
 *
 * @returns {number} The angle of the current stir in radians
 * @throws {Error} If the bottle is not in a stir
 */
function getCurrentStirDirection() {
  if (ret) return 0.0;
  /** the points have no coordinate at origin */
  const fromX = currentPlot.pendingPoints[0].x || 0.0;
  const fromY = currentPlot.pendingPoints[0].y || 0.0;
  let nextIndex = 0;
  while (nextIndex < currentPlot.pendingPoints.length) {
    nextIndex += 1;
    if (pointDistance(currentPlot.pendingPoints[0], currentPlot.pendingPoints[nextIndex]) > 1e-7) {
      break;
    }
  }
  if (nextIndex >= currentPlot.pendingPoints.length) {
    ret = 1;
    err = "Error while getting current stir direction: no next node.";
    return 0.0;
  } // Did not find a pendingPoints that is not the current point.
  const toX = currentPlot.pendingPoints[nextIndex].x || 0.0;
  const toY = currentPlot.pendingPoints[nextIndex].y || 0.0;
  return getDirectionByVector(toX - fromX, toY - fromY);
}

/**
 * Other utilities
 */

/**
 * Retrieves the radius of the current vortex.
 * @returns {number} The radius of the current vortex.
 * @throws {Error} If the bottle is not in a vortex.
 */
function getCurrentVortexRadius() {
  if (ret) return VortexRadiusLarge;
  const currentPoint = currentPlot.pendingPoints[0];
  return getTargetVortexInfo(currentPoint.x || 0.0, currentPoint.y || 0.0).r;
}

/**
 * Retrieves information about the target vortex at specified coordinates.
 * @param {number} targetX - The x-coordinate of the target vortex.
 * @param {number} targetY - The y-coordinate of the target vortex.
 * @returns {{x:number, y:number, r:number}} An object containing the x and y
 * coordinates and the radius of the target vortex.
 */
function getTargetVortexInfo(targetX, targetY) {
  let defaultOuput = { x: 0.0, y: 0.0, r: 0.0 };
  if (ret) return defaultOuput;
  const result = computePlot([
    createSetPosition(targetX, targetY),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (result == undefined) {
    ret = 1;
    err = "Error while getting target vortex radius: there is no vortex at target position.";
    return defaultOuput;
  }
  let testSmall = computePlot([
    createSetPosition(result.x + 1.8, result.y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (testSmall === undefined || testSmall.x != result.x || testSmall.y != result.y) {
    return { x: result.x, y: result.y, r: VortexRadiusSmall };
  }
  let testMedium = computePlot([
    createSetPosition(result.x + 2.2, result.y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (testMedium === undefined || testMedium.x != result.x || testMedium.y != result.y) {
    return { x: result.x, y: result.y, r: VortexRadiusMedium };
  }
  return { x: result.x, y: result.y, r: VortexRadiusLarge };
}

/**
 * Calculates the total deviation of the current bottle position from the target.
 *
 * @param {number} targetX - The X coordinate of the target position.
 * @param {number} targetY - The Y coordinate of the target position.
 * @param {number} targetAngle - The desired angle of the target effect in degrees.
 * @returns {number} The total deviation from the target position and angle.
 */

function getCurrentTargetError(targetX, targetY, targetAngle) {
  if (ret) return 0.0;
  const currentPoint = currentPlot.pendingPoints[0];
  const currentX = currentPoint.x || 0;
  const currentY = currentPoint.y || 0;
  const distanceDeviation =
    Math.sqrt((currentX - targetX) ** 2 + (currentY - targetY) ** 2) * 1800.0;
  const angleDelta = radToDeg(
    Math.abs(getRelativeDirection(degToRad(-currentPoint.angle), degToRad(targetAngle)))
  );
  const angleDeviation = (angleDelta * 100.0) / 12.0;
  const totalDeviation = distanceDeviation + angleDeviation;
  return totalDeviation;
}

/**
 * Returns the total amount of Sun Salt added so far.
 *
 * @returns {number} The total amount of Sun Salt.
 */
function getTotalSun() {
  return TotalSun;
}

/**
 * Returns the total amount of Moon Salt added so far.
 *
 * @returns {number} The total amount of Moon Salt.
 */
function getTotalMoon() {
  return TotalMoon;
}

/**
 * Complex subroutines: straighten the potion path.
 */

/**
 * Straighten the potion path with the least amount of salt.
 *
 * @param {number} maxStirLength The maximum distance to be stirred.
 * @param {number} direction The direction to be stirred in radian.
 * @param {string} [salt="moon"] The type of salt to be added. It must be "moon" or "sun".
 * @param {number} [maxGrains=Infinity] The maximum amount of salt to be added.
 * @param {boolean} [ignoreReverse=true] If set to false, the function will terminate when a reversed direction is detected.
 * @returns {number} The total amount of salt added.
 */
function straighten(
  maxStirLength,
  direction,
  salt = "moon",
  maxGrains = Infinity,
  ignoreReverse = true,
  leastSegmentLength = 1e-7
) {
  if (ret) return 0;
  if (salt != "moon" && salt != "sun") {
    ret = 1;
    err = "Error while straightening: salt must be moon or sun.";
    return 0;
  }
  let stirredLength = 0.0;
  let nextStirLength = 0.0;
  let nextSegmentLength = 0.0;
  let totalGrains = 0;
  let currentIndex = 0;
  let pendingPoints = currentPlot.pendingPoints;
  let lastSegment = false;
  while (!lastSegment) {
    const currentX = pendingPoints[currentIndex].x;
    const currentY = pendingPoints[currentIndex].y;
    let nextIndex = currentIndex;
    // Find the "real" next point by skipping "too close" points.
    while (true) {
      nextIndex += 1;
      if (nextIndex >= pendingPoints.length) {
        lastSegment = true;
        break;
      }
      nextSegmentLength += pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
      // Threshold to decide two points to be different.
      if (nextSegmentLength > leastSegmentLength) {
        break;
      }
    }
    if (nextSegmentLength <= leastSegmentLength) {
      continue;
    }
    const nextX = pendingPoints[nextIndex].x;
    const nextY = pendingPoints[nextIndex].y;
    const nextDirection = getDirectionByVector(nextX - currentX, nextY - currentY, direction);
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
        if (RoundStirring) {
          nextStirLength = Math.ceil(nextStirLength / StirringUnit) * StirringUnit;
        }
        logAddStirCauldron(nextStirLength);
        stirredLength += nextStirLength;
      }
      currentIndex = 0;
      nextSegmentLength = 0.0;
      nextStirLength = 0.0;
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
      nextStirLength += nextSegmentLength;
      nextSegmentLength = 0.0;
      if (nextStirLength + stirredLength >= maxStirLength) {
        /** If the stir length is capped, stir the remaining length and terminate. */
        nextStirLength = maxStirLength - stirredLength;
        if (RoundStirring) {
          nextStirLength = Math.ceil(nextStirLength / StirringUnit) * StirringUnit;
        }
        logAddStirCauldron(nextStirLength);
        console.log("Straignten terminated by maximal length stirred.");
        break;
      } else {
        currentIndex = nextIndex;
      }
    }
  }
  if (lastSegment) {
    // if break the loop by setting the `lastSegment` flag.
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
  // main script here.
  logError();
  logSalt();
}

/**
 * Useful for scripting offline.
 * Currently plotter do not support exports. Delete these export lines.
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
  isDangerZone,
  isStrongDangerZone,
  isVortex,
  // Stirring subroutines.
  stirIntoVortex,
  stirToEdge,
  stirToTurn,
  stirToDangerZoneExit,
  stirToNearestTarget,
  stirToTier,
  stirToConsume,
  // Pouring subroutines.
  pourToEdge,
  heatAndPourToEdge,
  pourToDangerZone,
  pourIntoVortex,
  derotateToAngle,
  // Angle conversions.
  degToRad,
  radToDeg,
  degToSalt,
  radToSalt,
  saltToDeg,
  saltToRad,
  // Angle and direction extractions.
  getDirectionByVector,
  getVectorByDirection,
  getRelativeDirection,
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  // Extraction of other informations.
  checkBase,
  getCurrentVortexRadius,
  getTargetVortexInfo,
  getCurrentTargetError,
  // Complex subroutines.
  straighten,
  // Utilities.
  getUnit,
  getTotalMoon,
  getTotalSun,
  setDisplay,
  setStirRounding,
  logError,
  logSalt,
};

export {
  SaltAngle,
  MinimalPour,
  VortexRadiusLarge,
  VortexRadiusMedium,
  VortexRadiusSmall,
  DeviationT2,
  DeviationT3,
  DeviationT1,
  EntityVortex,
  EntityPotionEffect,
  EntityDangerZone,
  EntityStrongDangerZone,
  Salt,
};
