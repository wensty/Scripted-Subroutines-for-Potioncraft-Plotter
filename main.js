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
import { currentPlot, computePlot, currentRecipeItems } from "@potionous/plot";

const SaltAngle = (2 * Math.PI) / 1000.0; // angle per salt in radian.
const VortexRadiusLarge = 2.39;
const VortexRadiusMedium = 1.99;
const VortexRadiusSmall = 1.74;
let Display = false; // Macro to switch instruction display.
let Step = 1;
let TotalSun = 0;
let TotalMoon = 0;

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
 * Computes the length of the stir from the current point to the first vortex,
 * and adds a stir instruction to the recipe for this length.
 *
 * This function attempts to stir until the bottle is about to enter a vortex.
 * If the current point is not within a vortex, an error is thrown.
 *
 * @throws {EvalError} If the operation is attempted outside of a vortex.
 */
function stirIntoVortex() {
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
      while (right - left > 0.0001) {
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

function stirIntoVortex_C(maxStirLength = Infinity) {
  const initialVortex = currentPlot.pendingPoints[0].bottleCollisions.find(isVortex);
  const initialCommittedNodes = currentPlot.committedPoints.length;
  const plot = computePlot(currentRecipeItems.concat(createStirCauldron(maxStirLength)));
  const initialIndex = Math.max(initialCommittedNodes - 1, 0);
  const testedCommittedNodes = plot.committedPoints.length;
  let nextIndex = initialIndex;
  let stirDistance = 0.0;
  while (true) {
    nextIndex += 1;
    if (nextIndex == testedCommittedNodes) {
      break;
    }
    const nextPoint = plot.committedPoints[nextIndex];
    const nextResult = nextPoint.bottleCollisions.find(isVortex);
    if (
      nextResult != undefined &&
      (initialVortex == undefined ||
        initialVortex.x != nextResult.x ||
        initialVortex.y != nextResult.y)
    ) {
      let left = stirDistance;
      let right =
        stirDistance +
        pointDistance(plot.committedPoints[nextIndex - 1], plot.committedPoints[nextIndex]);

      while (right - left > 0.0001) {
        let mid = left + (right - left) / 2;
        const plot = computePlot(currentRecipeItems.concat([createStirCauldron(mid)]));
        const result = plot.pendingPoints[0].bottleCollisions.find(isVortex);
        if (
          result != undefined &&
          (initialVortex == undefined || initialVortex.x != result.x || initialVortex.y != result.y)
        ) {
          right = mid;
        } else {
          left = mid;
        }
      }
      logAddStirCauldron(right);
      return;
    }
    stirDistance += pointDistance(
      plot.committedPoints[nextIndex - 1],
      plot.committedPoints[nextIndex]
    );
  }
  console.log("Error while stirring into vortex: no vortex found.");
  terminate();
  throw EvalError;
}

/**
 * Computes the length of the stir from the current point to the edge of the vortex,
 * and adds a stir instruction to the recipe for this length.
 *
 * This function attempts to stir until the bottle is about to leave the same vortex.
 * If the current point is not within a vortex, an error is thrown.
 *
 * @throws {EvalError} If the operation is attempted outside of a vortex.
 */
function stirToEdge() {
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
  while (right - left > 0.0001) {
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
 * @param {number} [stirBuffer=0.0] - The buffer value to add before the bottle is stirred.
 * @throws {EvalError} If the operation is attempted outside of a direction change.
 */
function stirToTurn(directionBuffer = 20 * SaltAngle, stirBuffer = 0.0) {
  const pendingPoints = currentPlot.pendingPoints;
  let currentDirection = getCurrentStirDirection();
  let currentIndex = 0;
  let nextIndex;
  let stirDistance = 0.0;
  let nextStirSegmentDistance = 0.0;
  while (true) {
    nextIndex = currentIndex;
    while (true) {
      nextStirSegmentDistance += pointDistance(
        pendingPoints[nextIndex],
        pendingPoints[nextIndex + 1]
      );
      nextIndex += 1;
      if (nextStirSegmentDistance > 1e-4) {
        break;
      }
    }
    if (nextIndex >= pendingPoints.length) {
      console.log("Error while stirring to turn: no next node.");
      terminate();
      throw EvalError;
    } // Did not find a node that is not the current point.
    const nextDirection = getDirectionByVector(
      pendingPoints[nextIndex].x - pendingPoints[currentIndex].x,
      pendingPoints[nextIndex].y - pendingPoints[currentIndex].y
      // currentDirection
    );
    const nextRelativeDirection = getDirectionByVector(
      pendingPoints[nextIndex].x - pendingPoints[currentIndex].x,
      pendingPoints[nextIndex].y - pendingPoints[currentIndex].y,
      currentDirection
    );
    if (Math.abs(nextRelativeDirection) > directionBuffer) {
      break;
    } else {
      stirDistance += nextStirSegmentDistance;
      nextStirSegmentDistance = 0.0;
      currentIndex = nextIndex;
      currentDirection = nextDirection;
    }
  }
  logAddStirCauldron(stirDistance + stirBuffer);
}

/**
 * Stir the potion to the safe zone.
 *
 * This function tries to stir the potion into a safe zone by binary search.
 * If the bottle is not in a danger zone, it does nothing.
 * This operation is not supported for wine base because of its unique properties.
 *
 * @param {number} [dangerBuffer=0.02] - The buffer value before the bottle is considered in danger.
 * @returns {number|undefined} The least health of the bottle during the process.
 * @throws {EvalError} If the base is wine, or if no safe zone is found.
 */
function stirToSafeZone(dangerBuffer = 0.02) {
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
    while (right - left > 0.0001) {
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
 * Stirs the potion towards the nearest point to a specified target coordinate.
 *
 * This function attempts to adjust the stirring path to approach the target
 * coordinates (targetX, targetY) as closely as possible. The stirring continues
 * until the endpoint of the path is reached or the potion begins to turn away
 * from the target. A binary search is used to fine-tune the stirring distance
 * when leaving the target.
 *
 * @param {number} targetX - The x-coordinate of the target position.
 * @param {number} targetY - The y-coordinate of the target position.
 * @param {number} [segmentBuffer=1e-4] - The buffer distance used for segment calculations.
 * @param {number} [approximateBuffer=0.01] - The buffer distance to adjust the binary search.
 */
function stirToNearestTarget(targetX, targetY, segmentBuffer = 1e-4, approximateBuffer = 0.01) {
  function binarySearch() {
    const distance = Math.sqrt(
      (currentPlot.pendingPoints[preparingIndex].x - targetX) ** 2 +
        (currentPlot.pendingPoints[preparingIndex].y - targetY) ** 2
    );
    const approximatedLastStir = Math.min(
      Math.cos(prepareingRelativeDirection) * distance,
      preparingStirLength
    ); // approximated last stir distance.
    let left = Math.max(currentStirLength + approximatedLastStir - approximateBuffer, 0.0);
    let right = Math.min(
      currentStirLength + approximatedLastStir + approximateBuffer,
      currentStirLength + preparingStirLength
    );
    while (right - left > 0.0001) {
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
  let currentIndex = 0; // the current index to detect a turning away.
  let currentStirLength = 0.0; // the current stir on the fully analyzed segments.
  let preparingStirLength = 0.0; // after the fully analyzed, the part prepared to apply binary search on
  // if the first segment is leaving the target, a binary search should be triggered.
  let prepareingRelativeDirection = 0.0; // the relative direction of the preparing segment.
  let nextSegmentLength = 0.0;
  const initialX = pendingPoints[0].x || 0.0;
  const initialY = pendingPoints[0].y || 0.0;
  // best distance found. Initialized by the distance at the start point.
  let bestDistance = Math.sqrt((targetX - initialX) ** 2 + (targetY - initialY) ** 2);
  let bestStir = 0.0; // corresponding stir distance. Initialized by not stirring.
  let currentX = initialX;
  let currentY = initialY;
  // console.log("!")
  while (true) {
    let nextIndex = currentIndex;
    currentX = pendingPoints[currentIndex].x || 0.0;
    currentY = pendingPoints[currentIndex].y || 0.0;
    while (true) {
      nextIndex += 1;
      if (nextIndex == pendingPoints.length) {
        // endpoint. Update last time and return.
        binarySearch();
        logAddStirCauldron(bestStir);
        return bestDistance;
      }
      nextSegmentLength += pointDistance(pendingPoints[nextIndex - 1], pendingPoints[nextIndex]);
      if (nextSegmentLength > segmentBuffer) {
        break;
      }
    }
    const nextX = pendingPoints[nextIndex].x || 0.0;
    const nextY = pendingPoints[nextIndex].y || 0.0;
    const nextDirection = getDirectionByVector(nextX - currentX, nextY - currentY);
    const targetDirection = getDirectionByVector(targetX - currentX, targetY - currentY);
    const relativeDirection = getRelativeDirection(nextDirection, targetDirection);
    if (
      prepareingRelativeDirection != undefined && // not the first segment.
      Math.abs(prepareingRelativeDirection) < Math.PI / 2 && // previously approaching target.
      Math.abs(relativeDirection) > Math.PI / 2 //currently leaving target.
    ) {
      binarySearch();
    }
    currentStirLength += preparingStirLength;
    preparingStirLength = nextSegmentLength;
    prepareingRelativeDirection = relativeDirection;
    nextSegmentLength = 0.0;
    preparingIndex = currentIndex;
    currentIndex = nextIndex;
  }
}

/**
 * Subroutines related to pouring solvent.
 */

/**
 * Pours solvent to the edge of a vortex.
 *
 * This function calculates the necessary amount of solvent to pour the potion
 * towards the edge of a vortex, using an approximation based on the current
 * position and direction relative to the vortex center. It performs a binary
 * search to accurately determine the amount of solvent needed to reach the
 * vortex edge and logs the action.
 *
 * @param {number} [vortexRadius=VortexRadiusLarge] - The radius of the vortex.
 * @param {number} [buffer=0.01] - The buffer distance to adjust the pour approximation.
 * @throws {EvalError} If the operation is attempted outside of a vortex.
 */

function pourToEdge(vortexRadius = VortexRadiusLarge, buffer = 0.01) {
  const currentPoint = currentPlot.pendingPoints[0];
  const vortex = currentPoint.bottleCollisions.find(isVortex);
  if (vortex === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    terminate();
    throw EvalError;
  } // In case this is called outside a vortex.
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
      (vortexRadius * Math.sin(vortexCenterAngle)) / Math.sin(relativePourDirection);
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
  while (right - left > 0.0001) {
    mid = left + (right - left) / 2;
    const plot = computePlot(currentRecipeItems.concat([createPourSolvent(mid)]));
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
 * Heats the potion and pours it to the edge of a vortex.
 *
 * This function heats the vortex by a specified length and then pours solvent
 * to move the bottle towards the edge of the vortex. This process is repeated
 * a specified number of times.
 *
 * @param {number} length - The amount of heat to add to the vortex in PotionCraft units.
 * @param {number} numbersToPour - The number of times the pour-to-edge process should be performed.
 * @param {number} [vortexRadius=2.39] - The radius of the vortex, used to limit the heating.
 * @throws {EvalError} If the bottle is not initially within a vortex.
 */

function heatAndPourToEdge(length, numbersToPour, vortexRadius = VortexRadiusLarge) {
  const pendingPoints = currentPlot.pendingPoints;
  const result = pendingPoints[0].bottleCollisions.find(isVortex);
  if (result === undefined) {
    console.log("Error while pouring to edge: bottle not in a vortex.");
    terminate();
    throw EvalError;
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
 * Pour to the moment before entering a danger zone.
 * @param {number} maxPourLength the max length to search for the pouring.
 */
function pourToDangerZone(maxPourLength, searchInterval = 0.05) {
  const initialPoint = currentPlot.pendingPoints[0];
  const result = initialPoint.bottleCollisions.find(isDangerZone);
  if (result != undefined) {
    console.log("Error while pouring to danger zone: bottle currently in danger zone.");
    terminate();
    throw EvalError;
  }
  const initialX = initialPoint.x || 0.0;
  const initialY = initialPoint.y || 0.0;
  const initialDistance = Math.sqrt(initialX ** 2 + initialY ** 2);
  maxPourLength = Math.min(maxPourLength, initialDistance);
  const base = PotionBases.current.id;
  let isWine = false;
  if (base == "wine") {
    isWine = true;
  }
  // initialization.
  let currentHealth = initialPoint.health;
  let currentPour = 0.0;
  let maxPourFlag = false;
  while (true) {
    let nextPour = currentPour + searchInterval;
    if (nextPour >= maxPourLength) {
      nextPour = maxPourLength;
      maxPourFlag = true;
    }
    const plot = computePlot(currentRecipeItems.concat([createPourSolvent(nextPour)]));
    const nextHealth = plot.pendingPoints[0].health;
    if (
      (isWine && nextHealth < Math.min(currentHealth + (nextPour - currentPour) * 0.1, 1.0)) ||
      (!isWine && nextHealth < 1.0)
    ) {
      // binary search
      let left = currentPour;
      let right = nextPour;
      while (right - left > 0.0001) {
        const mid = left + (right - left) / 2;
        const plot = computePlot(currentRecipeItems.concat([createPourSolvent(mid)]));
        const result = plot.pendingPoints[0].bottleCollisions.find(isDangerZone);
        if (result != undefined) {
          right = mid;
        } else {
          left = mid;
        }
      }
      logAddPourSolvent(left);
      return;
    }
    if (maxPourFlag) {
      console.log("Warning: No danger zone found in the given pour distance.");
      logAddStirCauldron(nextPour);
      return;
    }
    currentPour = nextPour;
    currentHealth = nextHealth;
  }
}

/**
 * Adjusts the rotation of the potion to a specified target angle.
 *
 * This function attempts to derotate the potion by calculating the necessary
 * amount of solvent to pour, aiming to reach the given target angle. The
 * derotation process can occur either relative to the origin or when inside a
 * vortex. If the target angle is zero, a full derotation is performed by
 * pouring an infinite amount of solvent.
 *
 * @param {number} targetAngle - The desired angle to derotate to, in radians.
 * @param {number} [buffer=0.01] - The buffer distance used to refine the pour
 * approximation.
 * @throws {EvalError} If the operation is attempted outside of the origin or a
 * vortex, or if attempting to derotate to a larger or reversed angle.
 */

function derotateToAngle(targetAngle, buffer = 0.01) {
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
        while (right - left > 0.0001) {
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
  if (Math.abs(x) < 1e-6 && Math.abs(y) < 1e-6) {
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

// There are only 3 types of vortexes, with radius 2.39,1.99,1.74

function getCurrentVortexSize() {
  console.log("Some bugs of plotter prevents this from functional.");
  terminate();
  throw EvalError;
  // const result = currentPlot.pendingPoints[0].bottleCollisions.find(isVortex);
  // if (result === undefined) {
  //   console.log("Error while finding the radius of the current");
  //   terminate();
  //   throw EvalError;
  // }
  // const vortex = result;
  // let testSmall = computePlot([
  //   createSetPosition(Vortex.x + 1.8, Vortex.y),
  // ]).pendingPoints[0].bottleCollisions.find(isVortex);
  // if (testSmall === undefined || testSmall.x != vortex.x || testSmall.y != vortex.y) {
  //   return VortexRadiusSmall;
  // }
  // let testMedium = computePlot([
  //   createSetPosition(Vortex.x + 2.2, Vortex.y),
  // ]).pendingPoints[0].bottleCollisions.find(isVortex);
  // if (testMedium === undefined || testMedium.x != Vortex.x || testMedium.y != Vortex.y) {
  //   return VortexRadiusMedium;
  // }
  // return VortexRadiusLarge;
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
      /**
       * the `Buffer` is here to avoid weird bugs.
       */
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
export { logAddIngredient, logAddMoonSalt, logAddSunSalt, logAddRotationSalt };
export { logAddHeatVortex, logAddStirCauldron, logAddPourSolvent, logAddSetPosition };
export { isDangerZone, isVortex };
export { stirIntoVortex, stirToEdge, stirToTurn, stirToSafeZone };
export { pourToEdge, heatAndPourToEdge, derotateToAngle };
export { checkBase, getUnit };
export { degToRad, radToDeg, degToSalt, radToSalt, saltToDeg, saltToRad };
export { getDirectionByVector, getVectorByDirection, getRelativeDirection };
export { getBottlePolarAngle, getBottlePolarAngleByVortex };
export { getCurrentStirDirection, getCurrentPourDirection };
export { straighten };

/**
 * Main function call running the script.
 */
Display = true; //Display the actual instructions added.
main();
console.log("Total moon salt added: " + TotalMoon);
console.log("Total sun salt added: " + TotalSun);
