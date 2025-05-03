// Subroutines defined in main script.
import { logAddIngredient, logAddPourSolvent, logAddStirCauldron } from "../main.js";
// wrapped instructions defined in main script to implement statistics.
import { straighten, stirToTurn } from "../main.js";
// utility functions defined in main script.
import { checkBase } from "../main.js";

import { Ingredients } from "@potionous/dataset";
function main() {
  checkBase("water");
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddStirCauldron(13);
  logAddPourSolvent(Infinity);
  stirToTurn();
  stirToTurn();
  stirToTurn();
  stirToTurn();
  stirToTurn();
  stirToTurn();
  stirToTurn();
  stirToTurn();
  straighten(Infinity, getCurrentStirDirection(), "sun", 50);
  return;
}
