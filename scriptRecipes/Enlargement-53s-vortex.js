import {
  logAddIngredient,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToEdge,
  stirToTurn,
  heatAndPourToEdge,
  degToRad,
  radToDeg,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
} from "../main";
import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("oil");
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddStirCauldron(4.5);
  logAddPourSolvent(0.68);
  stirIntoVortex();
  heatAndPourToEdge(0.4, 14);
  logAddHeatVortex(3.6);
  stirIntoVortex();
  stirToTurn();
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1.89);
  stirToTurn();
  stirToTurn();
  logAddPourSolvent(1.72);
  stirToTurn();
  logAddPourSolvent(1.86);
  console.log(radToDeg(getCurrentStirDirection()) + 180);
  stirToTurn();
  straighten(Infinity, degToRad(59.07 - 180), "sun", 53);
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity()));
  logAddHeatVortex(3);
  heatAndPourToEdge(0.07, 45);
  for (let i = 0; i < 44; i++) {
    logAddHeatVortex(0.07);
    stirToEdge();
  }
  logAddHeatVortex(0.032);
}
