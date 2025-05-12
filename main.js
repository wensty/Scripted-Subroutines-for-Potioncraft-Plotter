import { pointDistance } from "@potionous/common";

import {
  addIngredient,
  addMoonSalt,
  addSunSalt,
  addRotationSalt,
  addStirCauldron,
  addPourSolvent,
  addHeatVortex,
  addSetPosition,
  createStirCauldron,
  createPourSolvent,
  createSetPosition,
} from "@potionous/instructions";

import { Ingredients, PotionBases } from "@potionous/dataset";
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

const SaltAngle = (2 * Math.PI) / 1000.0; // angle per salt in radian.
const VortexRadiusLarge = 2.39;
const VortexRadiusMedium = 1.99;
const VortexRadiusSmall = 1.74;
const StirEpsilon = 1e-4;
const PourEpsilon = 2.5e-3;
const DeviationT2 = 600.0;
const DeviationT3 = 100.0;
const BottleRadius = 0.74;
// const DeviationT1 = BottleRadius * 2 * 1800;
const DefaultTPStart = true;
let Display = false; // Macro to switch instruction display.
let Step = 1;
let TotalSun = 0;
let TotalMoon = 0;

/**
 * Generally, functions named by "into" some entities move the bottle cross the boundary into it or vise versa.
 * Functions named by "to" some entities stop the bottle just about to move into it or vise versa.
 */

/**
 * Terminate the program by tricking the TypeScript type checker.
 * The function deliberately contains a type error to terminate the program.
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
 * If `display` is not given, the value of `Display` is used.
 */
function logAddSunSalt(grains) {
  if (Display) {
    console.log("Step " + Step + ": Adding " + grains + " grains of sun salt");
    Step += 1;
  }
  TotalSun += grains;
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
  TotalMoon += grains;
  addMoonSalt(grains);
}

/**
 * Logs the addition of rotation salt and adds it to the current plot.
 * @param {"moon"|"sun"} salt The type of rotation salt to add ("sun" or "moon").
 * @param {number} grains The amount of salt to add in grains.
 * If "display" is not given, the value of "Display" is used.
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
 * This function attempts to move the potion into a new vortex by
 * incrementally increasing the stir length. It uses a binary search
 * to precisely find the point where the potion enters a vortex.
 *
 * If the potion is not currently within a vortex, it will search
 * for the nearest vortex and stir into it. If no vortex is found,
 * an error is logged and the process is terminated.
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
 * This function calculates the optimal stirring length to move the potion
 * to the boundary of the vortex it is currently in. It uses a binary search
 * approach to precisely determine the stir length needed to reach the edge.
 *
 * If the potion is not currently within a vortex, an error is logged and
 * the process is terminated. If the edge of the vortex cannot be reached,
 * the function also terminates with an error.
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
 * Computes the length of the stir to the next direction change point, and adds a stir instruction to the recipe for this length.
 *
 * This function attempts to stir until the bottle is about to turn in a different direction.
 * If the current point is not within a direction change, an error is thrown.
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
 * Stir the cauldron into a safe zone.
 *
 * The function checks if the bottle is in a danger zone (health lower than 1 - dangerBuffer).
 * If it is not, the function does nothing.
 * If it is, the function stirs the cauldron until it reaches a safe zone.
 * The function returns the least health found in the safe zone.
 *
 * @param {number} [dangerBuffer=0.02] The buffer of health to determine if the bottle is in a danger zone.
 * @param {number} [epsilon=Epsilon] The precision for the binary search.
 * @return {number} The least health found in the safe zone.
 * @throws {Error} If the bottle is in a wine base or no safe zone is found.
 */
function stirIntoSafeZone(dangerBuffer = 0.02, epsilon = StirEpsilon) {
  const base = PotionBases.current.id;
  if (base == "wine") {
    console.log("Stir to safe zone is not supported for wine base.");
    terminate();
    throw EvalError;
  }
  const pendingPoints = currentPlot.pendingPoints;
  const currentHealth = pendingPoints[0].health;
  if (currentHealth > 1 - dangerBuffer) {
    console.log("Bottle not in danger zone.");
  } else {
    let stirDistance = 0.0;
    let nextIndex = 0;
    while (true) {
      nextIndex += 1;
      if (nextIndex == pendingPoints.length) {
        console.log("Error while stirring to safe zone: no safe zone found.");
        terminate();
        throw EvalError;
      }
      const health = pendingPoints[nextIndex].health;
      if (health > currentHealth) {
        break;
      } else {
        stirDistance += pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
      }
    }
    /**
     * Find the exact point of heal and find the least health.
     */
    let leastHealth = pendingPoints[nextIndex - 1].health;
    let left = stirDistance;
    let right =
      stirDistance + pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
    while (right - left > epsilon) {
      const mid = left + (right - left) / 2;
      const plot = computePlot(currentRecipeItems.concat([createStirCauldron(mid)]));
      const health = plot.pendingPoints[0].health;
      if (health > currentHealth) {
        right = mid;
      } else {
        left = mid;
        leastHealth = health;
      }
    }
    logAddStirCauldron(right);
    return leastHealth;
  }
}

/**
 * Stirs the potion towards the nearest target point (targetX, targetY)
 * and returns the minimum distance achieved during the stirring process.
 *
 * This function attempts to find the optimal stir path towards the
 * target point using a combination of linear segment analysis and
 * binary search for precision. It logs the best stirring distance
 * achieved that brings the potion closest to the target coordinates.
 *
 * If the potion is initially moving away from the target, a binary
 * search is initiated to find the best approach.
 *
 * This function is time-consuming. If possible, stir to near the point first.
 *
 * @param {number} targetX - The X coordinate of the target.
 * @param {number} targetY - The Y coordinate of the target.
 * @param {number} [leastSegmentLength=1e-4] - The minimum segment
 * length to consider for analysis.
 * @param {number} [approximateBuffer=0.01] - The buffer for
 * approximating the binary search range.
 * @param {number} [epsilon=Epsilon] - The precision for the
 * binary search.
 *
 * @returns {number} The minimum distance achieved to the target
 * during the stirring process.
 */
function stirToNearestTarget(
  targetX,
  targetY,
  leastSegmentLength = 1e-4,
  approximateBuffer = 0.01,
  epsilon = StirEpsilon
) {
  function binarySearchPreparingSegment() {
    let left = Math.max(currentStirLength + approximatedLastStir - approximateBuffer, 0.0);
    let right = Math.min(
      currentStirLength + approximatedLastStir + approximateBuffer,
      currentStirLength + preparingStirLength
    );
    while (right - left > epsilon) {
      const mid = left + (right - left) / 2;
      const plot = computePlot(currentRecipeItems.concat([createStirCauldron(mid)]));
      const testX = plot.pendingPoints[0].x;
      const testY = plot.pendingPoints[0].y;
      const testDistance = Math.sqrt((targetX - testX) ** 2 + (targetY - testY) ** 2);
      const relativeDirection = getRelativeDirection(
        getDirectionByVector(currentX - testX, currentY - testY),
        getDirectionByVector(targetX - testX, targetY - testY)
      );
      if (Math.abs(relativeDirection) > Math.PI / 2) {
        right = mid;
      } else {
        left = mid;
      }
      if (testDistance < bestDistance) {
        bestDistance = testDistance;
        bestStir = mid;
      }
    }
  }
  const pendingPoints = currentPlot.pendingPoints;
  let preparingIndex = 0; // prepare to binary search from that point.
  let preparingStirLength = 0.0; // after the fully analyzed, the part prepared to apply binary search on
  let currentIndex = 0; // the current index to detect a turning away.
  let currentStirLength = 0.0; // the current stir on the fully analyzed segments.
  let preparingRelativeDirection = Infinity; // the relative direction of the preparing segment.
  // if the first segment is leaving the target, a binary search should not be triggered.
  let currentSegmentLength = 0.0;
  const initialX = pendingPoints[0].x || 0.0;
  const initialY = pendingPoints[0].y || 0.0;
  // best distance found. Initialized by the distance at the start point.
  let bestDistance = Math.sqrt((targetX - initialX) ** 2 + (targetY - initialY) ** 2);
  let preparingDistance = bestDistance;
  let currentDistance = bestDistance;
  let approximatedLastStir = 0.0;
  let bestStir = 0.0; // corresponding stir distance. Initialized by not stirring.
  let currentX = initialX;
  let currentY = initialY;
  while (true) {
    let nextIndex = currentIndex;
    currentX = pendingPoints[currentIndex].x || 0.0;
    currentY = pendingPoints[currentIndex].y || 0.0;
    currentDistance = Math.sqrt((currentX - targetX) ** 2 + (currentY - targetY) ** 2);
    while (true) {
      nextIndex += 1;
      if (nextIndex == pendingPoints.length) {
        // endpoint. Update last time and return.
        binarySearchPreparingSegment();
        logAddStirCauldron(bestStir);
        return bestDistance;
      }
      currentSegmentLength += pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
      if (currentSegmentLength > leastSegmentLength) {
        break;
      }
    }
    const nextX = pendingPoints[nextIndex].x || 0.0;
    const nextY = pendingPoints[nextIndex].y || 0.0;
    const nextDirection = getDirectionByVector(nextX - currentX, nextY - currentY);
    const targetDirection = getDirectionByVector(targetX - currentX, targetY - currentY);
    const relativeDirection = getRelativeDirection(nextDirection, targetDirection);
    if (
      Math.abs(preparingRelativeDirection) < Math.PI / 2 && // previously approaching target.
      Math.abs(relativeDirection) > Math.PI / 2 // currently leaving target.
    ) {
      const distance = Math.sqrt(
        (currentPlot.pendingPoints[preparingIndex].x - targetX) ** 2 +
          (currentPlot.pendingPoints[preparingIndex].y - targetY) ** 2
      );
      approximatedLastStir = Math.cos(preparingRelativeDirection) * distance;
      // approximated best distance by last stir.
      let approximatedDistance;
      if (approximatedLastStir > preparingStirLength) {
        approximatedLastStir = preparingStirLength;
        approximatedDistance = Math.min(preparingDistance, currentDistance);
      } else {
        approximatedDistance = Math.sin(preparingRelativeDirection) * distance;
      }
      if (approximatedDistance < bestDistance + 0.05) {
        binarySearchPreparingSegment();
      }
    }
    currentStirLength += preparingStirLength;
    preparingStirLength = currentSegmentLength;
    preparingRelativeDirection = relativeDirection;
    preparingDistance = currentDistance;
    currentSegmentLength = 0.0;
    preparingIndex = currentIndex;
    currentIndex = nextIndex;
  }
}

/**
 * Stirs the potion to a specified tier of a target effect.
 *
 * This function calculates the stirring length required to reach a specified tier
 * of a target effect defined by its position and angle. It uses a combination of
 * geometry and binary search to determine the precise point at which the potion
 * achieves the desired target effect tier.
 *
 * If the angle deviation from the target is too large, an error is logged and the
 * process is terminated. The function also handles edge cases where the target
 * tier cannot be reached.
 *
 * This function is time-consuming. If possible, stir to near the point first.
 *
 * @param {number} targetX - The x-coordinate of the target effect.
 * @param {number} targetY - The y-coordinate of the target effect.
 * @param {number} targetAngle - The angle of the target effect in degrees.
 * @param {number} [maxDeviation=DeviationT2] - The maximum allowable deviation from the target angle.
 * @param {boolean} [ignoreAngle=false] - Whether to ignore angle deviation in calculations.
 * @param {number} [leastSegmentLength=1e-4] - The smallest segment length for stirring calculations.
 * @param {number} [approximateBuffer=0.01] - The buffer distance for binary search approximation.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the angle deviation is too large or if the target tier cannot be reached.
 */
function stirToTier(
  targetX,
  targetY,
  targetAngle,
  maxDeviation = DeviationT2,
  ignoreAngle = false,
  leastSegmentLength = 1e-4,
  approximateBuffer = 0.01,
  epsilon = StirEpsilon
) {
  function binarySearchPreparingSegment() {
    let left = Math.max(currentStirLength + approximatedLastStirLength - approximateBuffer, 0.0);
    let right = Math.min(
      currentStirLength + approximatedLastStirLength + approximateBuffer,
      currentStirLength + preparingStirLength
    );
    let midPointFound = false;
    while (right - left > epsilon) {
      const mid = left + (right - left) / 2;
      const plot = computePlot(currentRecipeItems.concat([createStirCauldron(mid)]));
      const testX = plot.pendingPoints[0].x;
      const testY = plot.pendingPoints[0].y;
      const testDistance = Math.sqrt((targetX - testX) ** 2 + (targetY - testY) ** 2);
      const relativeDirection = getRelativeDirection(
        getDirectionByVector(currentX - testX, currentY - testY),
        getDirectionByVector(targetX - testX, targetY - testY)
      );
      if (!midPointFound) {
        if (testDistance < requiredDistance) {
          right = mid;
          midPointFound = true;
        } else {
          if (Math.abs(relativeDirection) > Math.PI / 2) {
            right = mid;
          } else {
            left = mid;
          }
        }
      } else {
        if (testDistance < requiredDistance) {
          right = mid;
        } else {
          left = mid;
        }
      }
    }
    if (midPointFound) {
      logAddStirCauldron(right);
    }
    return midPointFound;
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
  if (angleDeviation > maxDeviation) {
    console.log("Error while stir to tier: too much angle deviation.");
    terminate();
    throw EvalError;
  }
  const requiredDistance = (maxDeviation - angleDeviation) / 1800.0;
  let currentStirLength = 0.0;
  let currentSegmentLength = 0.0;
  let preparingStirLength = 0.0;
  let preparingRelativeDirection = Infinity;
  const initialX = currentPlot.pendingPoints[0].x || 0.0;
  const initialY = currentPlot.pendingPoints[0].y || 0.0;
  let preparingDistance = Math.sqrt((targetX - initialX) ** 2 + (targetY - initialY) ** 2);
  let currentX = initialX;
  let currentY = initialY;
  let currentDistance = preparingDistance;
  let preparingIndex = 0;
  let currentIndex = preparingIndex;
  let approximatedLastStirLength = 0.0;
  while (true) {
    let nextIndex = currentIndex;
    currentX = currentPlot.pendingPoints[currentIndex].x || 0.0;
    currentY = currentPlot.pendingPoints[currentIndex].y || 0.0;
    currentDistance = Math.sqrt((targetX - currentX) ** 2 + (targetY - currentY) ** 2);
    while (true) {
      nextIndex += 1;
      if (nextIndex == currentPlot.pendingPoints.length) {
        const midPointFound = binarySearchPreparingSegment();
        if (!midPointFound) {
          console.log("Error while stirring to tier: can not reach the tier.");
          terminate();
          throw EvalError;
        } else {
          return;
        }
      }
      currentSegmentLength += pointDistance(
        currentPlot.pendingPoints[nextIndex - 1],
        currentPlot.pendingPoints[nextIndex]
      );
      if (currentSegmentLength > leastSegmentLength) {
        break;
      }
    }
    const nextX = currentPlot.pendingPoints[nextIndex].x || 0.0;
    const nextY = currentPlot.pendingPoints[nextIndex].y || 0.0;
    const nextDistance = Math.sqrt((nextX - targetX) ** 2 + (nextY - targetY) ** 2);
    const nextDirection = getDirectionByVector(nextX - currentX, nextY - currentY);
    const targetDirection = getDirectionByVector(targetX - currentX, targetY - currentY);
    const relativeDirection = getRelativeDirection(nextDirection, targetDirection);
    if (nextDistance < requiredDistance) {
      // the first entor point is in this segment.
      // Binary search the current segment to find the exact point and return.
      // nextDistance is only used in this test.
      const theta = Math.asin(
        (currentDistance * Math.sin(Math.abs(relativeDirection))) / requiredDistance
      );
      const alpha = theta - Math.abs(relativeDirection);
      approximatedLastStirLength = (currentDistance * Math.sin(alpha)) / Math.sin(theta);
      // approximate the distance
      let left = Math.max(
        currentStirLength + preparingStirLength + approximatedLastStirLength - approximateBuffer,
        0
      );
      let right =
        currentStirLength + preparingStirLength + approximatedLastStirLength + approximateBuffer;
      while (right - left > epsilon) {
        let mid = left + (right - left) / 2;
        const plot = computePlot(currentRecipeItems.concat([createStirCauldron(mid)]));
        const testPoint = plot.pendingPoints[0];
        const testX = testPoint.x || 0.0;
        const testY = testPoint.y || 0.0;
        const testDistance = Math.sqrt((testX - targetX) ** 2 + (testY - targetY) ** 2);
        if (testDistance > requiredDistance) {
          left = mid;
        } else {
          right = mid;
        }
      }
      logAddStirCauldron(right);
      return;
    }
    if (
      Math.abs(preparingRelativeDirection) < Math.PI / 2 && // previously approaching target.
      Math.abs(relativeDirection) > Math.PI / 2 //currently leaving target.
    ) {
      // binarySearch
      approximatedLastStirLength = Math.cos(preparingRelativeDirection) * preparingDistance;
      // approximated best distance by last stir.
      let approximatedDistance;
      if (approximatedLastStirLength > preparingStirLength) {
        approximatedLastStirLength = preparingStirLength;
        approximatedDistance = Math.min(preparingDistance, currentDistance);
      } else {
        approximatedDistance = Math.sin(preparingRelativeDirection) * preparingDistance;
      }
      if (approximatedDistance < requiredDistance + 0.05) {
        // binarySearch.
        const midPointFound = binarySearchPreparingSegment();
        if (midPointFound) {
          break;
        }
      }
    }
    currentStirLength += preparingStirLength;
    preparingStirLength = currentSegmentLength;
    preparingRelativeDirection = relativeDirection;
    preparingDistance = currentDistance;
    currentSegmentLength = 0.0;
    preparingIndex = currentIndex;
    currentIndex = nextIndex;
  }
}

/**
 * Subroutines related to pouring solvent.
 */

/**
 * Pours the solvent to the edge of a vortex.
 *
 * This function calculates the required amount of solvent to pour such that
 * the bottle moves to the edge of the current vortex. It uses binary search
 * to precisely determine the necessary pour length based on the vortex's
 * radius, the relative direction of pouring, and the current distance to
 * the vortex center.
 *
 * @param {number} [buffer=0.01] - The buffer to adjust the approximated pour length.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is not currently in a vortex.
 */
function pourToEdge(tpStart = DefaultTPStart, buffer = 0.01, epsilon = PourEpsilon) {
  const currentPoint = currentPlot.pendingPoints[0];
  const vortex = currentPoint.bottleCollisions.find(isVortex);
  if (vortex === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    terminate();
    throw EvalError;
  } // In case this is called outside a vortex.
  const vortexRadius = getCurrentVortexRadius();
  const relativePourDirection = getCurrentPourDirection(true);
  const vortexDistance = Math.sqrt(
    (currentPoint.x - vortex.x) ** 2 + (currentPoint.y - vortex.y) ** 2
  );
  /**
   * Approximates the amount of solvent required to pour to the edge of a vortex.
   *
   * This function calculates the length of solvent pouring needed based on the
   * relative direction of pouring, the distance to the vortex center, and the vortex radius.
   *
   * @param {number} relativePourDirection - The angle of pouring relative to the vortex center direction, in radians.
   * @param {number} vortexDistance - The distance from the current position to the vortex center.
   * @param {number} vortexRadius - The radius of the vortex.
   * @returns {number} The approximated length of pouring required to reach the vortex edge.
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
    if (tpStart) {
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
 * Pours the bottle into a vortex with precision.
 *
 * This function attempts to move the bottle into a new vortex by
 * incrementally increasing the pour length. It uses a binary search
 * to precisely find the point where the bottle enters a vortex.
 *
 * If the bottle is not currently within a vortex, it will search
 * for the nearest vortex and pour into it. If no vortex is found,
 * an error is logged and the process is terminated.
 *
 * @param {number} maxPourLength - The maximum length of solvent to pour.
 * @param {number} [buffer=0.01] - The buffer to adjust the initial pour length estimation.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is not currently in a vortex or cannot reach one.
 */
function pourIntoVortex(
  maxPourLength,
  tpStart = DefaultTPStart,
  buffer = 0.01,
  epsilon = PourEpsilon
) {
  // write a function that pours the bottle into a vortex.
  const initialPoint = currentPlot.pendingPoints[0];
  const initialX = initialPoint.x || 0.0;
  const initialY = initialPoint.y || 0.0;
  const initialVortex = initialPoint.bottleCollisions.find(isVortex);
  const initialIndex = Math.max(currentPlot.committedPoints.length - 1, 0);
  const plot = computePlot(currentRecipeItems.concat([createPourSolvent(maxPourLength)]));
  let nextIndex = initialIndex;
  let pourDistance = 0.0;
  while (true) {
    nextIndex += 1;
    if (nextIndex == plot.committedPoints.length) {
      console.log(
        "Error while pouring into vortex: can not find a new vortex in the given distacne."
      );
      terminate();
      throw EvalError;
    }
    const testPoint = plot.committedPoints[nextIndex];
    const testResult = testPoint.bottleCollisions.find(isVortex);
    if (
      testResult != undefined &&
      (initialVortex == undefined ||
        testResult.x != initialVortex.x ||
        testResult.y != initialVortex.y)
    ) {
      break;
    }
    pourDistance = pointDistance(initialPoint, testPoint);
  }
  let left = Math.max(pourDistance - buffer, 0.0);
  let right = pointDistance(initialPoint, plot.committedPoints[nextIndex]) + buffer;
  while (right - left > epsilon) {
    let mid = left + (right - left) / 2;
    let plot;
    if (tpStart) {
      plot = computePlot([createSetPosition(initialX, initialY), createPourSolvent(mid)]);
    } else {
      plot = computePlot(currentRecipeItems.concat([createPourSolvent(mid)]));
    }
    const result = plot.pendingPoints[0].bottleCollisions.find(isVortex);
    if (
      result == undefined ||
      (initialVortex != undefined && result.x != initialVortex.x && result.y != initialVortex.y)
    ) {
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
 * This function adds instructions to heat the bottle and pour solvent to the edge of the current
 * vortex. It repeats this process the given number of times. The pour length is determined by the
 * given length and the angle of the bottle relative to the vortex. The given length is the maximum
 * length of solvent to pour, but the actual length may be shorter if the bottle is approaching the
 * edge of the vortex. The function throws an error if the bottle is not currently in a vortex.
 *
 * @param {number} length - The maximum length of solvent to pour.
 * @param {number} numbersToPour - The number of times to repeat the heating and pouring process.
 * @throws {EvalError} If the bottle is not currently in a vortex.
 */
function heatAndPourToEdge(length, numbersToPour, tpStart = DefaultTPStart) {
  const pendingPoints = currentPlot.pendingPoints;
  const result = pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    terminate();
    throw EvalError;
  }
  const vortexRadius = getCurrentVortexRadius();
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
    pourToEdge(tpStart);
  }
}

/**
 * Pours the solvent towards a danger zone with precision.
 *
 * This function calculates the necessary amount of solvent to pour
 * in order to approach the edge of a danger zone without entering it.
 * It employs a binary search to determine the optimal pour length,
 * ensuring that the bottle reaches just before the danger zone.
 *
 * If the bottle is already in a danger zone, an error is logged and
 * the process terminates. The function will also terminate if it
 * determines that the danger zone cannot be reached within the
 * specified maximum pouring length.
 *
 * @param {number} maxPourLength - The maximum length of solvent to pour.
 * @param {number} [leftBuffer=0.01] - The buffer to adjust the initial pour length estimation.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is already in a danger zone or cannot reach one.
 */
function pourToDangerZone(
  maxPourLength,
  tpStart = DefaultTPStart,
  leftBuffer = 0.01,
  epsilon = PourEpsilon
) {
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
  if (tpStart) {
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
    if (tpStart) {
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
 * This function attempts to derotate the bottle to a target angle by
 * pouring the solvent. If the bottle is not currently in a vortex or
 * at the origin, an error is thrown.
 *
 * The function will also terminate if the derotation is deemed impossible
 * (i.e. the target angle is larger or reversed than the current angle).
 *
 * @param {number} targetAngle - The target angle to derotate to.
 * @param {number} [buffer=0.01] - The buffer to adjust the initial pour length estimation.
 * @param {number} [epsilon=Epsilon] - The precision for the binary search.
 * @throws {EvalError} If the bottle is not in a vortex or at the origin,
 * or if the derotation is impossible.
 */
function derotateToAngle(targetAngle, buffer = 0.01, epsilon = PourEpsilon) {
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
  if (Math.abs(x) < 1e-9 && Math.abs(y) < 1e-9) {
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
 * The direction angle is from the base direction angle. The base direction angle is
 * optional and defaults to 0.0, which is the north direction.
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
 *
 * This function takes two direction angles, and returns the relative direction
 * between them. The relative direction is the direction from the base direction
 * to the given direction. The relative direction is always between -Math.PI and
 * Math.PI.
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
 * This function calculates the angle of the vector (x, y) from the base direction,
 * considering the orientation in 2D space. The result is the angle in radians.
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
 * This function calculates the angle from the current position of the bottle to the origin
 * or vice versa based on the `to` parameter. If the bottle is at the origin, an error is thrown.
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
 * This function calculates the angle from the current position of the bottle to the center
 * of the nearest vortex or vice versa based on the `to` parameter. If the bottle is not
 * in a vortex, an error is thrown. If the bottle is at the center of the vortex, an error
 * is thrown.
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
 * Computes the direction angle of the current bottle position relative to the vortex
 * or absolute direction.
 *
 * This function calculates the direction angle of the current bottle position relative
 * to the center of the nearest vortex if the `byVortex` parameter is true, or relative
 * to the absolute direction if it is false. If the bottle is not in a vortex and
 * `byVortex` is true, an error is thrown. If the bottle is at the center of the
 * vortex, an error is thrown.
 *
 * @param {boolean} [byVortex=true] - If true, calculates the direction relative to the center of the vortex.
 *                              If false, calculates the absolute direction.
 * @returns {number} The direction angle in radians.
 * @throws {EvalError} If the bottle is not in a vortex or at the center of a vortex.
 */
function getCurrentPourDirection(byVortex = true) {
  let baseDirection = 0.0;
  if (byVortex) {
    const result = currentPlot.pendingPoints[0].bottleCollisions.find(isVortex);
    if (result === undefined) {
      console.log("Error while getting pour direction relative to vortex: bottle not in a vortex.");
      terminate();
      throw EvalError;
    }
    baseDirection = getBottlePolarAngleByVortex(false);
  }
  const pourDirection = getBottlePolarAngle(false);
  return getRelativeDirection(pourDirection, baseDirection);
}

/**
 * Other utilities
 */

/**
 * Determines the size of the current vortex by testing positions around it.
 *
 * This function calculates the radius of the vortex the bottle is currently in
 * by setting a position near the vortex center and checking if it is still within
 * the same vortex. It tests positions for small, medium, and large vortex radii
 * and returns the corresponding radius size. If the bottle is not currently in
 * a vortex, an error is thrown.
 *
 * @returns {number} The radius of the current vortex.
 * @throws {EvalError} If the bottle is not in a vortex.
 */
function getCurrentVortexRadius() {
  const result = currentPlot.pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    console.log("Error while finding the radius of the current");
    terminate();
    throw EvalError;
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
 * Calculates the total deviation of the current bottle position from the target.
 *
 * This function computes the error or deviation of the current bottle position and angle
 * relative to a specified target position (targetX, targetY) and target angle. It calculates
 * the distance deviation based on the Euclidean distance between the current position and
 * the target position, scaled by a factor. It also calculates the angle deviation in degrees
 * based on the relative direction difference between the current angle and the target angle,
 * scaled by a factor. The total deviation is the sum of the distance and angle deviations.
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
 * Straightens the potion path by adjusting the stirring direction using rotation salt.
 *
 * This function iteratively adjusts the stirring direction of the potion based on the specified
 * parameters. It attempts to straighten the path up to a specified maximum distance using either
 * "moon" or "sun" salt, while considering the maximum allowed grains of salt and whether to ignore
 * reverse directions.
 *
 * @param {number} maxStirDistance - The maximum distance to stir in PotionCraft units.
 * @param {number} direction - The initial direction in radians to align the stirring.
 * @param {"moon"|"sun"} [salt="moon"] - The type of rotation salt to use ("moon" or "sun").
 * @param {number} [maxGrains=Infinity] - The maximum grains of salt that can be used.
 * @param {boolean} [ignoreReverse=true] - Whether to ignore reverse directions.
 * @throws {EvalError} If the salt is neither "moon" nor "sun".
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
  /**
   * To avoid weird bugs of plotter.
   * Can be set to 0 with current beta with new bug fixes.
   */
  const Buffer = 0.0;
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
        logAddStirCauldron(nextDistance + Buffer);
        distanceStirred += nextDistance + Buffer;
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
      // console.log(nextDistance)
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
}

/**
 * Main function. Put actual scripts here.
 */
function main() {
  return;
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
  isVortex,
  // Stirring subroutinees.
  stirIntoVortex,
  stirToEdge,
  stirToTurn,
  stirIntoSafeZone,
  stirToNearestTarget,
  stirToTier,
  // Pouring subroutines.
  pourToEdge,
  heatAndPourToEdge,
  pourToDangerZone,
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
  getCurrentTargetError,
  // Checking for entities in future path.
  checkStrongDangerZone,
  // Complex subroutines.
  straighten,
  // Utilities.
  getUnit,
};

/**
 * Main function call running the script.
 */
Display = true; //Display the actual instructions added.
main();
console.log("Total moon salt added: " + TotalMoon);
console.log("Total sun salt added: " + TotalSun);
