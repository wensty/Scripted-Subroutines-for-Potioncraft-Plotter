import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToDangerZoneExit,
  stirToNearestTarget,
  pourToZone,
  derotateToAngle,
} from "../main";
import { Effects } from "../main";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

function main() {
  logAddSunSalt(501);
  logAddIngredient(Ingredients.GraveTruffle);
  derotateToAngle(-36.11);
  stirToDangerZoneExit();
  for (let i = 0; i < 15; i++) {
    logAddStirCauldron(0.1);
    pourToZone(0.25);
  }
  logAddStirCauldron(0.1);
  logAddPourSolvent(0.01);
  stirToNearestTarget(Effects.Wine.Swiftness, { preStirLength: 1.5, maxStirLength: 0.1 });
  logAddMoonSalt(Math.round((45 - currentPlot.pendingPoints[0].angle) / 0.36));
  logAddStirCauldron(1e-9);
  logAddMoonSalt(178);
  logAddStirCauldron(5.6);
  logAddSunSalt(26);
  logAddStirCauldron(7.246);
  logAddSunSalt(435);
  logAddStirCauldron(Infinity);
  logAddPourSolvent(2.14);
}
