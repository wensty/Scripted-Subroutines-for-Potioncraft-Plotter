import {
  logAddIngredient,
  logAddPourSolvent,
  logAddSetPosition,
  stirToZone,
  pourToZoneV2,
  checkBase,
} from "../main";
import { Entity } from "../main";

import { Ingredients } from "@potionous/dataset";

/**
 * Best for (strong or weak) danger zones, swamps and healing zones.
 * Plotter have precise calculation on these zones.
 * For effects and vortexes, use dedicated functions that is geometric-based and much more accurate.
 * Provide estimated pour length to accelerate the script running.
 */
function test_pour_to_zone_full_parameter() {
  checkBase("wine");
  logAddSetPosition(15, 14);
  pourToZoneV2({
    zone: Entity.StrongDangerZone,
    prePourLength: 4.7,
    maxPourLength: 0.5,
    exitZone: false,
    overPour: true,
  });
  logAddIngredient(Ingredients.Windbloom);
}

/**
 * Default behavior is stopping before strong danger zone.
 */
function test_pour_to_zone_default() {
  checkBase("water");
  logAddSetPosition(-4, 19);
  pourToZoneV2();
  logAddIngredient(Ingredients.MadMushroom);
}

function test_stir_to_zone_full_parameter() {
  checkBase("water");
  logAddSetPosition(5, 9);
  logAddIngredient(Ingredients.Firebell);
  stirToZone({
    zone: Entity.StrongDangerZone,
    preStirLength: 0.5,
    overStir: true,
    exitZone: false,
  });
  logAddPourSolvent(3);
}

function test_stir_to_zone() {
  checkBase("water");
  logAddIngredient(Ingredients.PhantomSkirt);
  stirToZone();
}
