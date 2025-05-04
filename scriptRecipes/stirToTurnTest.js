// Wrapped ingredient and salt instructions.
import { logAddIngredient } from "../main";
// Wrapped operation instructions.
import { logAddStirCauldron } from "../main";
import { logAddPourSolvent } from "../main";
// Stirring subroutinees.
import { stirToTurn } from "../main";
// Angle extractions.
import { getCurrentStirDirection } from "../main";
// Utilities.
import { checkBase } from "../main";
// Complex subroutines.
import { straighten } from "../main";

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
