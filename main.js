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
  createStirCauldron,
  createPourSolvent,
  // createSetPosition,
} from "@potionous/instructions";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

const SaltAngle = (2 * Math.PI) / 1000.0; // angle per salt in radian.
const VortexRadiusLarge = 2.39;
const VortexRadiusMedium = 1.99;
const VortexRadiusSmall = 1.74;
const StirEpsilon = 1e-4;
const PourEpsilon = 2e-3;
const DeviationT2 = 600.0;
const DeviationT3 = 100.0;
const BottleRadius = 0.74;
// const DeviationT1 = BottleRadius * 2 * 1800;
const CreateSetPositionEnabled = false;
const Display = true; // Macro to switch instruction display.
let Step = 1;
let TotalSun = 0;
let TotalMoon = 0;

/**
 * Generally, functions named by "into" some entities move the bottle cross the boundary into it or vise versa.
 * Functions named by "to" some entities stop the bottle just about to move into it or vise versa.
 */

function terminate() {
  // Dirty way to terminate the program.
  const terminator = 0;
  // @ts-ignore
  terminator = 1;
}

/**
 * Checks if the currentpotion base is the given expected base.
 * @param {"water"|"oil"|"wine"} expectedBase The expected base name.
 */
function checkBase(expectedBase) {
  if (!["water", "oil", "wine"].includes(expectedBase)) {
    console.log("Unknown expected base: " + expectedBase + ".");
    terminate();
    throw EvalError;
  } else {
    const currentBase = PotionBases.current.id;
    if (currentBase != expectedBase) {
      console.log("" + currentBase + " is not the expected base " + expectedBase + ".");
      terminate();
      throw EvalError;
    }
  }
}

function logSalt() {
  console.log("Total moon salt: " + TotalMoon + ", Total sun salt: " + TotalSun);
  return;
}

/**
 * Logging function to display the current step and the action taken.
 */

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
 * @returns {number} The amount of sun salt added in grains.
 */

function logAddSunSalt(grains) {
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
  if (salt != "moon" && salt != "sun") {
    console.log("Error while adding rotation salt: salt must be moon or sun.");
    terminate();
    throw EvalError;
  }
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
    console.log("Step " + Step + ": teleporting to (" + x + ", " + y + ")");
    Step += 1;
  }
  addSetPosition(x, y);
}

/**
 * Detection functions for different entity types.
 */

/**
 * Checks if the given point is a danger zone.
 * @param {import("@potionous/dataset").PotionBaseEntity} x Checked entity.
 * @returns {boolean} True if the entity type is a danger zone, false otherwise.
 */
function isDangerZone(x) {
  return ["StrongDangerZonePart", "WeakDangerZonePart", "DangerZonePart"].includes(x.entityType);
}

/**
 * Checks if the given point is a strong danger zone.
 * @param {import("@potionous/dataset").PotionBaseEntity} x Checked entity.
 */

function isStrongDangerZone(x) {
  return ["StrongDangerZonePart", "DangerZonePart"].includes(x.entityType);
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
 * Subroutines related to stirring.
 */

/**
 * Stirs the potion into a vortex.
 *
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If no vortex is found in the pending points.
 */

function stirIntoVortex(epsilon = StirEpsilon) {
  const pendingPoints = currentPlot.pendingPoints;
  const currentVortex = pendingPoints[0].bottleCollisions.find(isVortex);
  let stirLength = 0.0;
  let index = 0;
  while (true) {
    index += 1;
    if (index == pendingPoints.length) {
      console.log("Error while stirring into vortex: no vortex found.");
      terminate();
      throw EvalError;
    }
    const result = pendingPoints[index].bottleCollisions.find(isVortex);
    if (
      result != undefined &&
      (currentVortex == undefined || result.x != currentVortex.x || result.y != currentVortex.y)
    ) {
      // Find the node into the vortex.
      let left = stirLength;
      let right = stirLength + pointDistance(pendingPoints[index - 1], pendingPoints[index]);
      while (right - left > epsilon) {
        const mid = left + (right - left) / 2;
        const plot = computePlot(currentRecipeItems.concat([createStirCauldron(mid)]));
        const entities = plot.pendingPoints[0].bottleCollisions;
        if (entities.some(isVortex)) {
          right = mid;
        } else {
          left = mid;
        }
      }
      logAddStirCauldron(right);
      return;
    }
    stirLength += pointDistance(pendingPoints[index - 1], pendingPoints[index]);
  }
}

/**
 * Stirs the potion to the edge of the current vortex.
 *
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the potion is not in a vortex or cannot reach the vortex edge.
 */

function stirToEdge(epsilon = StirEpsilon) {
  const pendingPoints = currentPlot.pendingPoints;
  const vortex = pendingPoints[0].bottleCollisions.find(isVortex);
  let stirLength = 0.0;
  if (vortex === undefined) {
    console.log("Error while stirring to edge: bottle not in a vortex.");
    terminate();
    throw EvalError;
  }
  let index = 0;
  while (true) {
    index += 1;
    const result = pendingPoints[index].bottleCollisions.find(isVortex);
    if (result === undefined || result.x != vortex.x || result.y != vortex.y) {
      break;
    } else {
      if (index == pendingPoints.length) {
        console.log("Can not reach the edge of the vortex.");
        terminate();
        throw EvalError;
      }
      stirLength += pointDistance(pendingPoints[index - 1], pendingPoints[index]);
    }
  }
  let left = stirLength;
  let right = stirLength + pointDistance(pendingPoints[index - 1], pendingPoints[index]);
  while (right - left > epsilon) {
    const mid = left + (right - left) / 2;
    const plot = computePlot(currentRecipeItems.concat(createStirCauldron(mid)));
    const result = plot.pendingPoints[0].bottleCollisions.find(isVortex);
    // Same vortex detection. Uses shortcut conditioning.
    if (result === undefined || result.x != vortex.x || result.y != vortex.y) {
      right = mid;
    } else {
      left = mid;
    }
  }
  logAddStirCauldron(left);
}

/**
 * Computes the length of the stir to the next direction change point.
 *
 * @param {number} [directionBuffer=20 * SaltAngle] - The buffer value before the bottle is considered in a different direction.
 * @param {number} [stirBuffer=0.0] - The buffer value to additionally stir the bottle to avoid weird bugs.
 * @throws {EvalError} If the operation is attempted outside of a direction change.
 */
function stirToTurn(maxStirLength = Infinity, directionBuffer = 20 * SaltAngle, stirBuffer = 0.0) {
  const pendingPoints = currentPlot.pendingPoints;
  let currentDirection = getCurrentStirDirection();
  let currentIndex = 0;
  let nextIndex;
  let stirLength = 0.0;
  let nextStirSegmentDistance = 0.0;
  while (true) {
    nextIndex = currentIndex;
    while (true) {
      nextIndex += 1;
      if (nextIndex >= pendingPoints.length) {
        console.log("Error while stirring to turn: no next node.");
        terminate();
        throw EvalError;
      } // Did not find a node that is not the current point.
      nextStirSegmentDistance += pointDistance(
        pendingPoints[nextIndex - 1],
        pendingPoints[nextIndex]
      );
      if (nextStirSegmentDistance > 1e-4) {
        break;
      }
    }
    const nextDirection = getDirectionByVector(
      pendingPoints[nextIndex].x - pendingPoints[currentIndex].x,
      pendingPoints[nextIndex].y - pendingPoints[currentIndex].y
      // currentDirection
    );
    const nextRelativeDirection = getRelativeDirection(nextDirection, currentDirection);
    if (Math.abs(nextRelativeDirection) > directionBuffer) {
      break;
    } else {
      stirLength += nextStirSegmentDistance;
      nextStirSegmentDistance = 0.0;
      currentIndex = nextIndex;
      currentDirection = nextDirection;
      if (stirLength >= maxStirLength) {
        logAddStirCauldron(maxStirLength);
        return;
      }
    }
  }
  logAddStirCauldron(stirLength + stirBuffer);
}

/**
 * Stirs the potion to the edge of the current or next danger zone.
 *
 * @return {number} The least health value encountered while stirring.
 * @throws {EvalError} If the potion is not in a danger zone or cannot reach a safe zone.
 */
function stirToDangerZoneExit() {
  const pendingPoints = currentPlot.pendingPoints;
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
      console.log("Error while stirring to safe zone: no safe zone found.");
      terminate();
      throw EvalError;
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
  logAddStirCauldron(stirDistance); // calculation by plotter is accurate enough.
  return leastHealth;
}

/**
 * Stirs the potion to the closest point to the target position within the given
 * maximum stir length.
 * @param {number} targetX The x-coordinate of the target.
 * @param {number} targetY The y-coordinate of the target.
 * @param {number} [maxStirLength=Infinity] The maximum length to stir the potion.
 * @param {number} [leastSegmentLength=1e-9] The minimum length between points to
 *     consider in the optimization.
 * @return {number} The minimum distance between the target and the potion after
 *     stirring.
 */
function stirToNearestTarget(
  targetX,
  targetY,
  maxStirLength = Infinity,
  leastSegmentLength = 1e-9
) {
  const pendingPoints = currentPlot.pendingPoints;
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
    if (currentStirLength + nextSegmentLength > maxStirLength) {
      isLastSegment = true;
    }
    const nextX = pendingPoints[nextIndex].x || 0.0;
    const nextY = pendingPoints[nextIndex].y || 0.0;
    const nextUnit = getUnit(nextX - currentX, nextY - currentY);
    const lastStirLength = nextUnit[0] * (targetX - currentX) + nextUnit[1] * (targetY - currentY);
    if (lastStirLength > nextSegmentLength) {
      const nextDistance = Math.sqrt((targetX - nextX) ** 2 + (targetY - nextY) ** 2);
      if (nextDistance < optimalDistance) {
        optimalStirLength = currentStirLength + lastStirLength;
        optimalDistance = nextDistance;
      }
    } else {
      if (lastStirLength >= 0) {
        const lastOptimalDistance = Math.abs(
          -nextUnit[1] * (targetX - currentX) + nextUnit[0] * (targetY - currentY)
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
  logAddStirCauldron(optimalStirLength);
  return optimalDistance;
}

/**
 * Computes the length of the stir to the next tier change point.
 *
 * @param {number} targetX - The target x position.
 * @param {number} targetY - The target y position.
 * @param {number} targetAngle - The target angle in degree.
 * @param {number} [maxDeviation=DeviationT2] - The maximum allowed angle deviation in degree.
 * @param {boolean} [ignoreAngle=false] - Whether to ignore angle deviation.
 * @param {number} [leastSegmentLength=1e-9] - The least length of each segment.
 * @param {number} [approximateBuffer=1e-4] - The buffer value to guarantee stirring into given tier.
 */
function stirToTier(
  targetX,
  targetY,
  targetAngle,
  maxDeviation = DeviationT2,
  ignoreAngle = false,
  leastSegmentLength = 1e-9,
  approximateBuffer = 1e-5
) {
  const pendingPoints = currentPlot.pendingPoints;
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
    console.log("Error while stir to tier: too much angle deviation.");
    terminate();
    throw EvalError;
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
  let currentDistance = Math.sqrt((targetX - initialX) ** 2 + (targetY - initialY) ** 2);
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
    let lastStirLength = nextUnit[0] * (targetX - currentX) + nextUnit[1] * (targetY - currentY);
    if (lastStirLength > currentSegmentLength) {
      if (nextDistance < requiredDistance) {
        const lineDistance =
          -nextUnit[1] * (targetX - currentX) + nextUnit[0] * (targetY - currentY);
        const approximatedLastStirLength =
          lastStirLength - Math.sqrt(requiredDistance ** 2 - lineDistance ** 2);
        // findExactStir(approximatedLastStirLength);
        logAddStirCauldron(
          currentStirLength +
            Math.min(approximatedLastStirLength + approximateBuffer, currentSegmentLength)
        );
        return;
      }
    } else {
      if (lastStirLength >= 0) {
        const nextDistance =
          -nextUnit[1] * (targetX - currentX) + nextUnit[0] * (targetY - currentY);
        const approximatedLastStirLength =
          lastStirLength - Math.sqrt(requiredDistance ** 2 - nextDistance ** 2);
        if (nextDistance < requiredDistance) {
          // findExactStir(approximatedLastStirLength);
          logAddStirCauldron(
            currentStirLength +
              Math.min(approximatedLastStirLength + approximateBuffer, lastStirLength)
          );
          return;
        }
      }
    }
    currentIndex = nextIndex;
    currentX = nextX;
    currentY = nextY;
    currentDistance = nextDistance;
    currentStirLength += currentSegmentLength;
    currentSegmentLength = 0.0;
  }
  console.log("Error while stirring to tier: cannot reach target tier.");
  terminate();
  throw EvalError;
}

/**
 * Subroutines related to pouring solvent.
 */

/**
 * Pours solvent to the edge of the current vortex.
 *
 * @param {number} [assumedVortexRadius=VortexRadiusLarge] - The assumed radius of the vortex.
 * @param {number} [buffer=0.02] - The buffer around the edge of the vortex to pour to.
 * @param {number} [epsilon=PourEpsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is not in a vortex or cannot reach the vortex edge.
 */
function pourToEdge(assumedVortexRadius = VortexRadiusLarge, buffer = 0.02, epsilon = PourEpsilon) {
  const currentPoint = currentPlot.pendingPoints[0];
  const vortex = currentPoint.bottleCollisions.find(isVortex);
  if (vortex === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    terminate();
    throw EvalError;
  } // In case this is called outside a vortex.
  let vortexRadius = assumedVortexRadius; // default value if we do not have CreateSetPosition.
  if (CreateSetPositionEnabled) {
    vortexRadius = getCurrentVortexRadius();
  } else {
    ("Warning while pouring to edge: default vortex radius assumed.");
  }
  const relativePourDirection = getCurrentPourDirection();
  const vortexDistance = Math.sqrt(
    (currentPoint.x - vortex.x) ** 2 + (currentPoint.y - vortex.y) ** 2
  );
  /**
   * @param {number} relativePourDirection - The angle of pouring relative to the vortex center direction, in radians.
   * @param {number} vortexDistance - The distance from the current position to the vortex center.
   * @param {number} vortexRadius - The radius of the vortex.
   */
  function approximateDistance(relativePourDirection, vortexDistance, vortexRadius) {
    const vortexEdgeAngle = Math.asin(
      (Math.sin(Math.abs(relativePourDirection)) * vortexDistance) / vortexRadius
    );
    const vortexCenterAngle = Math.PI - Math.abs(relativePourDirection) - vortexEdgeAngle;
    const approximatedDistance =
      (vortexRadius * Math.sin(vortexCenterAngle)) / Math.sin(Math.abs(relativePourDirection));
    return approximatedDistance;
  }
  const approximatedDistance = approximateDistance(
    relativePourDirection,
    vortexDistance,
    vortexRadius
  );
  let left = Math.max(approximatedDistance - buffer, 0);
  let right = approximatedDistance + buffer;
  let mid;
  while (right - left > epsilon) {
    mid = left + (right - left) / 2;
    let plot;
    if (CreateSetPositionEnabled) {
      plot = computePlot([
        createSetPosition(currentPoint.x, currentPoint.y),
        createPourSolvent(mid),
      ]); // use tp replace the mass instructions.
    } else {
      plot = computePlot(currentRecipeItems.concat([createPourSolvent(mid)]));
    }
    const result = plot.pendingPoints[0].bottleCollisions.find(isVortex);
    if (result === undefined || result.x != vortex.x || result.y != vortex.y) {
      right = mid;
    } else {
      left = mid;
    }
  }
  logAddPourSolvent(left);
}

/**
 * Pours into a specific target vortex.
 *
 * @param {number} targetVortexX - The x-coordinate of the target vortex.
 * @param {number} targetVortexY - The y-coordinate of the target vortex.
 * @param {number} [assumedVortexRadius=VortexRadiusLarge] - The assumed radius of the target vortex when createSetPosition is not enabled.
 * @param {number} [buffer=0.02] - The buffer to adjust the initial pour length estimation.
 * @param {number} [epsilon=PourEpsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is not in a vortex or at the origin,
 * or if the derotation is impossible.
 */
function pourIntoVortex(
  targetVortexX,
  targetVortexY,
  assumedVortexRadius = VortexRadiusLarge,
  buffer = 0.02,
  epsilon = PourEpsilon
) {
  let vortexX;
  let vortexY;
  let vortexRadius;
  if (CreateSetPositionEnabled) {
    const _result = getTargetVortexRadius(targetVortexX, targetVortexY);
    vortexX = _result[0];
    vortexY = _result[1];
    vortexRadius = _result[2];
  } else {
    console.log("Warning while pouring into certain vortex: assumed value used.");
    vortexX = targetVortexX;
    vortexY = targetVortexY;
    vortexRadius = assumedVortexRadius;
  }
  const currentPoint = currentPlot.pendingPoints[0];
  const currentX = currentPoint.x || 0.0;
  const currentY = currentPoint.y || 0.0;
  const distance = Math.sqrt(currentX ** 2 + currentY ** 2);
  const vortexDistance = Math.sqrt(vortexX ** 2 + vortexY ** 2);
  if (distance < vortexDistance) {
    console.log("Error while pouring into target vortex: can not reach target vortex.");
    terminate();
    throw EvalError;
  }
  const beta = Math.abs(
    getRelativeDirection(
      getDirectionByVector(currentX, currentY),
      getDirectionByVector(vortexX, vortexY)
    )
  );
  if (vortexDistance * Math.sin(beta) >= vortexRadius) {
    console.log("Error while pouring into target vortex: can not reach target vortex.");
    terminate();
    throw EvalError;
  }
  const theta = Math.asin((vortexDistance * Math.sin(beta)) / vortexRadius);
  const approximatedPourLength =
    distance - (vortexRadius * Math.sin(beta + theta)) / Math.sin(beta);
  if (approximatedPourLength < 0) {
    console.log("Error while pouring into target vortex: already in given vortex");
    terminate();
    throw EvalError;
  }
  let left = Math.max(approximatedPourLength - buffer, 0.0);
  let right = approximatedPourLength + buffer;
  while (right - left > epsilon) {
    let mid = left + (right - left) / 2;
    let plot;
    if (CreateSetPositionEnabled) {
      plot = computePlot([createSetPosition(currentX, currentY), createPourSolvent(mid)]);
    } else {
      plot = computePlot(currentRecipeItems.concat([createPourSolvent(mid)]));
    }
    const result = plot.pendingPoints[0].bottleCollisions.find(isVortex);
    if (result === undefined || result.x != vortexX || result.y != vortexY) {
      left = mid;
    } else {
      right = mid;
    }
  }
  logAddPourSolvent(right);
}

/**
 * Heats and pours to the edge of the current vortex.
 *
 * @param {number} length - The maximum length of solvent to pour.
 * @param {number} numbersToPour - The number of times to repeat the heating and pouring process.
 * @throws {EvalError} If the bottle is not currently in a vortex.
 */
function heatAndPourToEdge(length, numbersToPour, assumedVortexRadius = VortexRadiusLarge) {
  const pendingPoints = currentPlot.pendingPoints;
  const result = pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    terminate();
    throw EvalError;
  }

  let vortexRadius = assumedVortexRadius;
  if (CreateSetPositionEnabled) {
    vortexRadius = getCurrentVortexRadius();
  } else {
    console.log("Warning while pouring to edge: default vortex radius assumed.");
  }

  for (let i = 0; i < numbersToPour; i++) {
    const pendingPoints = currentPlot.pendingPoints;
    const x = pendingPoints[0].x || 0.0;
    const y = pendingPoints[0].y || 0.0; // unnecessary since origin is not in a vortex.
    const vortexAngle = getDirectionByVector(x, y, getBottlePolarAngleByVortex());
    let maxLength = Infinity;
    if (vortexAngle > Math.PI / 2) {
      // Do not heat too much.
      maxLength = vortexRadius * (vortexAngle - Math.PI / 2) * 0.25;
    }
    logAddHeatVortex(Math.min(length, maxLength));
    pourToEdge();
  }
}

/**
 * Pours the solvent towards danger zone with precision.
 *
 * @param {number} maxPourLength - The maximum length of solvent to pour.
 * @param {number} [leftBuffer=0.01] - The buffer to adjust the initial pour length estimation.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is already in a danger zone or cannot reach one.
 */
function pourToDangerZone(maxPourLength, leftBuffer = 0.01, epsilon = PourEpsilon) {
  const initialResult = currentPlot.pendingPoints[0].bottleCollisions.find(isDangerZone);
  if (initialResult != undefined) {
    console.log("Error while pouring to danger zone: already in danger zone.");
    terminate();
    throw EvalError;
  }
  const initialCommittedIndex = Math.max(currentPlot.committedPoints.length - 1, 0);
  const initialX = currentPlot.pendingPoints[0].x || 0.0;
  const initialY = currentPlot.pendingPoints[0].y || 0.0;
  let plot;
  let nextIndex;
  if (CreateSetPositionEnabled) {
    plot = computePlot([createSetPosition(initialX, initialY), createPourSolvent(maxPourLength)]);
    nextIndex = 0;
  } else {
    plot = computePlot(currentRecipeItems.concat([createPourSolvent(maxPourLength)]));
    nextIndex = initialCommittedIndex;
  }
  let pourLength = 0.0;

  while (true) {
    nextIndex += 1;
    if (nextIndex == plot.committedPoints.length) {
      console.log("Error while pouring to danger zone: cannot reach danger zone.");
      terminate();
      throw EvalError;
    }
    if (plot.committedPoints[nextIndex].bottleCollisions.find(isDangerZone) != undefined) {
      break;
    }
    pourLength = pointDistance(
      currentPlot.committedPoints[initialCommittedIndex],
      plot.committedPoints[nextIndex]
    );
  }
  let left = Math.max(pourLength - leftBuffer, 0.0);
  let right =
    pourLength +
    pointDistance(plot.committedPoints[nextIndex - 1], plot.committedPoints[nextIndex]);
  while (right - left > epsilon) {
    let mid = left + (right - left) / 2;
    let testResult;
    if (CreateSetPositionEnabled) {
      testResult = computePlot([
        createSetPosition(initialX, initialY),
        createPourSolvent(mid),
      ]).pendingPoints[0].bottleCollisions.find(isDangerZone);
    } else {
      testResult = computePlot(
        currentRecipeItems.concat(createPourSolvent(mid))
      ).pendingPoints[0].bottleCollisions.find(isDangerZone);
    }
    if (testResult != undefined) {
      right = mid;
    } else {
      left = mid;
    }
  }
  logAddPourSolvent(left);
}

/**
 * Derotates the bottle to a target angle with precision.
 *
 * @param {number} targetAngle - The target angle to derotate to, in degree.
 * @param {number} [buffer=0.012] - The buffer to adjust the initial pour length estimation.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is not in a vortex or at the origin,
 * or if the derotation is impossible.
 */
function derotateToAngle(targetAngle, buffer = 0.012, epsilon = PourEpsilon) {
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
    terminate();
    throw EvalError;
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
      console.log("Error while derotating: Cannot derotate to larger or reversed angle.");
      terminate();
      throw EvalError;
    }
  }
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
 * @returns {{salt: "moon"|"sun", grains: number}} The salt equivalent of the given degrees
 */
function degToSalt(deg) {
  let salt;
  if (deg > 0) {
    salt = "sun";
  } else {
    salt = "moon";
  }
  const grains = (Math.abs(deg) * 500.0) / 180.0;
  return { salt: salt, grains: grains };
}

/**
 * Converts radians to salt.
 * @param {number} rad The radians to convert
 * @returns {{salt: "moon"|"sun", grains: number}} The salt equivalent of the given radians
 */
function radToSalt(rad) {
  let salt;
  if (rad > 0) {
    salt = "sun";
  } else {
    salt = "moon";
  }
  const grains = (Math.abs(rad) * 500.0) / Math.PI;
  return { salt: salt, grains: grains };
}

/**
 * Converts salt to degree.
 * @param {"moon"|"sun"} salt The salt type ("moon" or "sun")
 * @param {number} grains The number of grains of salt
 * @returns {number} The degree equivalent of the given salt and grains
 * @throws {EvalError} If the salt is not "moon" or "sun"
 */
function saltToDeg(salt, grains) {
  if (salt == "moon") {
    return (-grains * 180.0) / 500.0;
  } else if (salt == "sun") {
    return (grains * 180.0) / 500.0;
  } else {
    console.log("Error while converting salt to degree: salt must be moon or sun.");
    terminate();
    throw EvalError;
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
  if (salt == "moon") {
    return (-grains * Math.PI) / 500.0;
  } else if (salt == "sun") {
    return (grains * Math.PI) / 500.0;
  } else {
    console.log("Error while converting salt to radian: salt must be moon or sun.");
    terminate();
    throw EvalError;
  }
}

/**
 * Computes the unit vector of a 2D vector.
 * @param {number} x The x component of the vector
 * @param {number} y The y component of the vector
 * @returns {Array.<number>} The unit vector of the given vector
 * @throws {Error} If the vector is a zero vector
 */
function getUnit(x, y) {
  if (Math.abs(x) < 1e-12 && Math.abs(y) < 1e-12) {
    console.log("Error while getting unit: zero vector.");
    terminate();
    throw EvalError;
  } else {
    return [x / Math.sqrt(x ** 2 + y ** 2), y / Math.sqrt(x ** 2 + y ** 2)];
  }
}

/**
 * Computes a 2D vector from a direction angle and an optional base direction angle.
 *
 * @param {number} direction The direction angle in radians
 * @param {number} [baseDirection=0.0] The base direction angle in radians
 * @returns {Array.<number>} The 2D vector from the given direction and base direction
 */
function getVectorByDirection(direction, baseDirection = 0.0) {
  let x = Math.sin(baseDirection + direction);
  let y = Math.cos(baseDirection + direction);
  return [x, y];
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
  let relativeDirection = direction - baseDirection;
  if (relativeDirection < -Math.PI) {
    relativeDirection += 2 * Math.PI;
  }
  if (relativeDirection > Math.PI) {
    relativeDirection -= 2 * Math.PI;
  }
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
  const _xy = getUnit(x, y);
  const _x = _xy[0];
  const _y = _xy[1];
  const relX = _x * Math.cos(baseDirection) - _y * Math.sin(baseDirection);
  const relY = _y * Math.cos(baseDirection) + _x * Math.sin(baseDirection);
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
 * @throws {EvalError} If the bottle is at the origin.
 */
function getBottlePolarAngle(toBottle = true) {
  const currentPoint = currentPlot.pendingPoints[0];
  let x = currentPoint.x || 0.0;
  let y = currentPoint.y || 0.0;
  if (x == 0.0 && y == 0.0) {
    console.log("Can not get the direction of origin.");
    terminate();
    throw EvalError;
  }
  if (!toBottle) {
    x = -x;
    y = -y;
  }
  return getDirectionByVector(x, y);
}

/**
 * Computes the direction angle of the current bottle position relative to a vortex.
 *
 * @param {boolean} [toBottle=true] - If true, calculates the direction from the current position to the center of the vortex.
 *                              If false, calculates the direction from the center of the vortex to the current position.
 * @returns {number} The direction angle in radians.
 * @throws {EvalError} If the bottle is not in a vortex or at the center of a vortex.
 */
function getBottlePolarAngleByVortex(toBottle = true) {
  const currentPoint = currentPlot.pendingPoints[0];
  const vortex = currentPoint.bottleCollisions.find(isVortex);
  if (vortex === undefined) {
    console.log("Bottle not in a vortex.");
    terminate();
    throw EvalError;
  }
  let deltaX = (currentPoint.x || 0.0) - vortex.x;
  let deltaY = (currentPoint.y || 0.0) - vortex.y;
  if (Math.abs(deltaX) < 1e-6 && Math.abs(deltaY) < -6) {
    console.log("Can not get vortex angle at center of vortex.");
    terminate();
    throw EvalError;
  }
  if (!toBottle) {
    deltaX = -deltaX;
    deltaY = -deltaY;
  }
  return getDirectionByVector(deltaX, deltaY);
}

/**
 * Computes the angle of the current stir in radians.
 *
 * @returns {number} The angle of the current stir in radians
 * @throws {Error} If the bottle is not in a stir
 */
function getCurrentStirDirection() {
  /** the points have no coordinate at origin */
  const fromX = currentPlot.pendingPoints[0].x || 0.0;
  const fromY = currentPlot.pendingPoints[0].y || 0.0;
  let nextIndex = 1;
  while (nextIndex < currentPlot.pendingPoints.length) {
    if (pointDistance(currentPlot.pendingPoints[0], currentPlot.pendingPoints[nextIndex]) > 1e-4) {
      break;
    }
    nextIndex += 1;
  }
  if (nextIndex >= currentPlot.pendingPoints.length) {
    console.log("Error while getting current stir direction: no next node.");
    terminate();
    throw EvalError;
  } // Did not find a pendingPoints that is not the current point.
  const toX = currentPlot.pendingPoints[nextIndex].x || 0.0;
  const toY = currentPlot.pendingPoints[nextIndex].y || 0.0;
  return getDirectionByVector(toX - fromX, toY - fromY);
}

/**
 * Computes the direction angle of the current bottle position relative to the vortex.
 *
 * @returns {number} The direction angle in radians.
 * @throws {EvalError} If the bottle is not in a vortex or at the center of a vortex.
 */
function getCurrentPourDirection() {
  let baseDirection = 0.0;
  const result = currentPlot.pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    console.log("Error while getting pour direction relative to vortex: bottle not in a vortex.");
    terminate();
    throw EvalError;
  }
  baseDirection = getBottlePolarAngleByVortex(false);
  const pourDirection = getBottlePolarAngle(false);
  return getRelativeDirection(pourDirection, baseDirection);
}

/**
 * Other utilities
 */

/**
 * Determines the size of the current vortex by testing positions around it.
 *
 * @returns {number} The radius of the current vortex.
 * @throws {EvalError} If the bottle is not in a vortex.
 */
function getCurrentVortexRadius() {
  const result = currentPlot.pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    console.log(
      "Error while finding the radius of current vortex: current point is not in a vortex."
    );
    terminate();
    throw EvalError;
  }
  if (!CreateSetPositionEnabled) {
    console.log(
      "Warining while finding the radius of current vortex: createSetPosition is not enabled. Return default value."
    );
    return VortexRadiusLarge;
  }
  const vortex = result;
  let testSmall = computePlot([
    createSetPosition(vortex.x + 1.8, vortex.y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (testSmall === undefined || testSmall.x != vortex.x || testSmall.y != vortex.y) {
    return VortexRadiusSmall;
  }
  let testMedium = computePlot([
    createSetPosition(vortex.x + 2.2, vortex.y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (testMedium === undefined || testMedium.x != vortex.x || testMedium.y != vortex.y) {
    return VortexRadiusMedium;
  }
  return VortexRadiusLarge;
}

/**
 * Determines the size of the target vortex by testing positions around it.
 *
 * @param {number} targetVortexX - The x-coordinate of the target vortex.
 * @param {number} targetVortexY - The y-coordinate of the target vortex.
 * @returns {[number, number, number]} The x-coordinate, y-coordinate, and radius of the target vortex.
 * @throws {EvalError} If there is no vortex at the target position.
 */
function getTargetVortexRadius(targetVortexX, targetVortexY) {
  const plot = computePlot([createSetPosition(targetVortexX, targetVortexY)]);
  const result = plot.pendingPoints[0].bottleCollisions.find(isVortex);
  if (result == undefined) {
    console.log("Error while getting target vortex radius: there is no vortex at target position.");
    terminate();
    throw EvalError;
  }
  const _x = result.x;
  const _y = result.y;
  if (!CreateSetPositionEnabled) {
    console.log(
      "Warning while getting target vortex radius: createSetPosition not valid. Return default value."
    );
    return [_x, _y, VortexRadiusLarge];
  }
  let testSmall = computePlot([
    createSetPosition(_x + 1.8, _y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (testSmall === undefined || testSmall.x != _x || testSmall.y != _y) {
    return [_x, _y, VortexRadiusSmall];
  }
  let testMedium = computePlot([
    createSetPosition(_x + 2.2, _y),
  ]).pendingPoints[0].bottleCollisions.find(isVortex);
  if (testMedium === undefined || testMedium.x != _x || testMedium.y != _y) {
    return [_x, _y, VortexRadiusMedium];
  }
  return [_x, _y, VortexRadiusLarge];
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
 * Path check functions.
 */

/**
 * If the bottle is not touching a strong danger zone,
 * check if it will touch a danger zone within the given distance.
 * @param {number} checkDistance the distance to be checked.
 * @return {number|undefined} distance to the strong danger zone. undefined if there is none.
 */
function checkStrongDangerZone(checkDistance) {
  const initialResult = currentPlot.pendingPoints[0].bottleCollisions.find(isStrongDangerZone);
  if (initialResult != undefined) {
    console.log(
      "Error while checking future strong danger zone: bottle currently in strong danger zone."
    );
    terminate();
    throw EvalError;
  }
  const currentCommitedNodes = currentPlot.committedPoints.length;
  const plot = computePlot(currentRecipeItems.concat([createStirCauldron(checkDistance)]));
  const checkedCommitedNode = plot.committedPoints.length;
  let currentIndex = Math.max(currentCommitedNodes - 1, 0);
  let stirDistance = 0.0;
  let nextIndex;
  for (nextIndex = currentIndex; nextIndex < checkedCommitedNode; nextIndex += 1) {
    stirDistance += pointDistance(
      plot.committedPoints[nextIndex - 1],
      plot.committedPoints[nextIndex]
    );
    const result = plot.committedPoints[nextIndex].bottleCollisions.find(isStrongDangerZone);
    if (result != undefined) {
      return stirDistance;
    }
  }
  return undefined;
}

/**
 * Complex subroutines: straighten the potion path.
 */

/**
 * Straighten the potion path with the least amount of salt.
 *
 * @param {number} maxStirDistance The maximum distance to be stirred.
 * @param {number} direction The direction to be stirred in radian.
 * @param {string} [salt="moon"] The type of salt to be added. It must be "moon" or "sun".
 * @param {number} [maxGrains=Infinity] The maximum amount of salt to be added.
 * @param {boolean} [ignoreReverse=true] If set to false, the function will terminate when a reversed direction is detected.
 * @returns {number} The total amount of salt added.
 */
function straighten(
  maxStirDistance,
  direction,
  salt = "moon",
  maxGrains = Infinity,
  ignoreReverse = true
) {
  if (salt != "moon" && salt != "sun") {
    console.log("Error while straightening: salt must be moon or sun.");
    terminate();
    throw EvalError;
  }
  let distanceStirred = 0.0;
  let nextDistance = 0.0;
  let nextSegmentDistance = 0.0;
  let totalGrains = 0;
  let currentIndex = 0;
  let pendingPoints = currentPlot.pendingPoints;
  while (true) {
    const currentX = pendingPoints[currentIndex].x;
    const currentY = pendingPoints[currentIndex].y;
    let nextIndex = currentIndex;
    // Find the "real" next point by skipping "too close" points.
    while (true) {
      nextSegmentDistance += pointDistance(pendingPoints[nextIndex], pendingPoints[nextIndex + 1]);
      nextIndex += 1;
      // Threshold to decide two points to be different.
      if (nextSegmentDistance > 1e-4) {
        break;
      }
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
      if (nextDistance > 0.0) {
        logAddStirCauldron(nextDistance);
        distanceStirred += nextDistance;
      }
      currentIndex = 0;
      nextSegmentDistance = 0.0;
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
      nextDistance += nextSegmentDistance;
      nextSegmentDistance = 0.0;
      if (nextDistance + distanceStirred >= maxStirDistance) {
        /** If the distance is capped, stir the remaining path and terminate. */
        nextDistance = maxStirDistance - distanceStirred;
        logAddStirCauldron(nextDistance);
        console.log("Straignten terminated by maximal length stirred.");
        break;
      } else {
        currentIndex = nextIndex;
        if (pendingPoints.length < currentIndex + 2) {
          console.log("Straignten terminated by end of path.");
          logAddStirCauldron(nextDistance);
          break;
        }
      }
    }
  }
  console.log("Added " + totalGrains + " grains of " + salt + " salt.");
  return totalGrains;
}

/**
 * if the functions are imported from github, we have no access to the global statistics and we have to manually calculate them.
 */
function main() {
  // main script here.
  logSalt();
}

/**
 * Useful for scripting offline.
 * Currently plotter do not support exports. Delete these export lines.
 */
export {
  logAddIngredient,
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
  getBottlePolarAngleByVortex,
  getCurrentStirDirection,
  getCurrentPourDirection,
  // Extraction of other informations.
  checkBase,
  getCurrentVortexRadius,
  getTargetVortexRadius,
  getCurrentTargetError,
  // Checking for entities in future path.
  checkStrongDangerZone,
  // Complex subroutines.
  straighten,
  // Utilities.
  getUnit,
  logSalt,
};
