import {
  logAddIngredient,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToNearestTarget,
  heatAndPourToEdge,
  derotateToAngle,
  radToDeg,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
} from "../main";

import { Ingredients } from "@potionous/dataset";

function beta() {
  checkBase("water");
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  logAddStirCauldron(5.525);
  logAddPourSolvent(Infinity);
  console.log(radToDeg(getCurrentStirDirection()));
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity()) - 90);
  logAddHeatVortex(3);
  logAddStirCauldron(4);
  stirToTurn();
  stirToTurn();
  logAddPourSolvent(4);
  heatAndPourToEdge(0.5, 8);
  logAddHeatVortex(0.087);
  for (let i = 0; i < 3; i++) {
    stirToTurn();
  }
  straighten(0.8, getCurrentStirDirection(), "sun");
  stirToDangerZoneExit();
  logAddSunSalt(117 - 60);
  stirIntoVortex();
  logAddStirCauldron(0.336);
  derotateToAngle(0);
  logAddHeatVortex(3.13);
  logAddStirCauldron(0.832);
  logAddHeatVortex(4.58);
  stirToNearestTarget(-14, 1.12);
}
