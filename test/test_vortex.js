import {
  logAddIngredient,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  logAddSetPosition,
  stirIntoVortex,
  stirToVortexEdge,
  stirToConsume,
  pourToVortexEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  checkBase,
} from "../main";

import { Ingredients } from "@potionous/dataset";
/**
 * Stir and pour to the edge of vortex, from inside or outside.
 */
function test_vortex_operation() {
  checkBase("water");
  logAddSetPosition(0, -35);
  logAddIngredient(Ingredients.Watercap);
  stirIntoVortex(9.1);
  stirToVortexEdge(4.2);
  // one parameter: assign a least distance to be stirred to accelerate execution.
  pourToVortexEdge();
  heatAndPourToEdge(3, 7);
  // max distance and repeats.
  logAddPourSolvent(2.47);
}

function test_pour_into_vortex() {
  checkBase("water");
  logAddSetPosition(-9, 9);
  pourIntoVortex(-5, 5); // any point inside the vortex
}
/**
 * Virtual path consuming with vortex.
 * The final position after consumption is fixed for easier adjusting.
 */
function test_consumption() {
  checkBase("water");
  logAddIngredient(Ingredients.Goldthorn);
  stirIntoVortex(6);
  stirToConsume(11.5);
  /**
   * Be careful whether the consumption is really possible.
   * And be careful with possible de-rotation within the real consumption process.
   */
  logAddHeatVortex(Infinity);
  stirIntoVortex();
  logAddHeatVortex(1);
  logAddStirCauldron(3.55);
  logAddPourSolvent(0.27);
}
