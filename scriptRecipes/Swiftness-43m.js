import {
  logAddIngredient,
  logAddStirCauldron,
  logAddPourSolvent,
  radToDeg,
  getCurrentStirDirection,
  checkBase,
  straighten,
} from "../main";
import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  logAddIngredient(Ingredients.RainbowCap, 1);
  logAddStirCauldron(14.4);
  logAddPourSolvent(100);
  console.log("Current stir angle: " + radToDeg(getCurrentStirDirection()));
  logAddStirCauldron(3.8);
  let currentStirAngle = getCurrentStirDirection();
  console.log("Current stir angle: " + radToDeg(currentStirAngle));
  straighten(currentStirAngle, "moon", { maxStirLength: 10, maxGrains: 43 });
}
