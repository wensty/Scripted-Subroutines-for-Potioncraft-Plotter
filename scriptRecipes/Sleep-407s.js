import {
  logAddIngredient,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  checkBase,
  straighten,
} from "../main";
import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("water");
  logAddSunSalt(87);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddSunSalt(21);
  logAddStirCauldron(3);
  straighten(Infinity, 1.82, "sun", 253 - 21, true);
  logAddStirCauldron(12.245);
  logAddHeatVortex(2);
  derotateToAngle(0);
  heatAndPourToEdge(0.3, 20);
  logAddHeatVortex(5.9);
  straighten(Infinity, degToRad(129), "sun", 67, true);
  stirIntoVortex();
  logAddHeatVortex(5.12);
  derotateToAngle(0);
  logAddPourSolvent(4.129);
}
