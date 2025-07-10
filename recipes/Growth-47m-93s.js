import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  stirIntoVortex,
  stirToTurn,
  stirToNearestTarget,
  heatAndPourToEdge,
  derotateToAngle,
  getBottlePolarAngleByEntity,
  checkBase,
  logError,
  logSalt,
} from "../main";
import { Effects } from "../main";

import { Ingredients } from "@potionous/dataset";

function beta() {
  // main script here.
  checkBase("water");
  logAddIngredient(Ingredients.GraveTruffle);
  logAddMoonSalt(47);
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  stirIntoVortex();
  stirToTurn({ preStirLength: 3 });
  heatAndPourToEdge(3, 7);
  derotateToAngle(0);
  logAddHeatVortex(1.09);
  logAddSunSalt(93);
  console.log(getBottlePolarAngleByEntity());
  stirIntoVortex();
  console.log(getBottlePolarAngleByEntity() + Math.PI);
  heatAndPourToEdge(3, 6);
  logAddHeatVortex(0.3);
  stirIntoVortex();
  derotateToAngle(0);
  heatAndPourToEdge(3, 7);
  logAddHeatVortex(1.64);
  stirToNearestTarget(Effects.Water.WildGrowth, { preStirLength: 3.3, maxStirLength: 0.2 });
  logError();
  logSalt();
}
