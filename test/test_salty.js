/**
 * Full import script.
 */

import {
  logAddIngredient,
  logAddSunSalt,
  logAddSetPosition,
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  pourUntilAngle,
  degToRad,
  checkBase,
  straighten,
} from "../main";
import { Salt } from "../main";

import { Ingredients } from "@potionous/dataset";

/**
 * Virtual derotation, so be careful if it is possible.
 * Only usable at origin or touching a vortex.
 * The angle is in degree, since in plotter it is saved in degree.
 * Clockwise(sun salt) is positive and counter-clockwise(moon salt) is negative.
 * Defaut behavior is derotate to the given angle. Can be set to derotate by the given angle.
 */
function test_derotate() {
  checkBase("water");
  logAddSetPosition(16, 6);
  logAddSunSalt(253);
  pourToVortexEdge();
  heatAndPourToEdge(3, 5);
  derotateToAngle(0, { toAngle: true });
}

/**
 * Pour solvent until the bottle is at the given angle.
 * This process causes real move towards origin.
 */
function test_pour_until_angle() {
  checkBase("water");
  logAddSetPosition(17, 0);
  logAddSunSalt(499);
  pourUntilAngle(90, { minPour: 8, maxPour: 11, overPour: false });
}

/**
 * Straighten the path by automatically add the assigned salt.
 * Use radian direction.
 * `Salt` is a pre-defiend object for name of rotation salts.
 * The process terminates if maximum length reached, maximum grains reached,
 * reversed straighten direction(i.e. another salt is required to straighten the path),
 * or the path is completely consumed.
 *
 * Straightened path can be proven to be optimal in some cases.
 */
function test_straighten() {
  checkBase("water");
  logAddIngredient(Ingredients.Goldthorn);
  straighten(degToRad(-80), Salt.Sun, { maxStirLength: 8.0, maxGrains: 500, ignoreReverse: false });
}
