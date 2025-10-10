/**
 * Full import script.
 */

import {
  logAddIngredient,
  logAddSunSalt,
  logAddStirCauldron,
  stirToNearestTarget,
  stirToTier,
  checkBase,
} from "../main";
import { DeviationT1, Effects } from "../main";

import { Ingredients } from "@potionous/dataset";

/**
 * Stir to the nearest point of target points.
 * The effects have pre-defined object as target points.
 * Assign approximate distance to accelerate the script.
 */
function test_stir_to_nearest_target() {
  checkBase("oil");
  logAddIngredient(Ingredients.Goodberry);
  logAddSunSalt(6);
  logAddStirCauldron(2.636);
  logAddSunSalt(3);
  stirToNearestTarget(Effects.Oil.Healing, { preStirLength: 6.8, maxStirLength: 0.5 });
}

/**
 * Stir to exactly get the tier.
 * The max allowed deviation is pre-defined.
 * To achieve T1 the bottle angle is not considered. Set `ignoreAngle` to define this behavior.
 * Addign approximate distance to accelerate the script.
 */
function test_stir_to_tier() {
  logAddIngredient(Ingredients.HealersHeather);
  stirToTier(Effects.Water.Healing, {
    preStirLength: 7.0,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
}
