import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToNearestTarget,
  stirToTier,
  pourToEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  derotateToAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
  setStirRounding,
} from "../main";
import { EntityVortex, Effects } from "../main";

import { currentPlot } from "@potionous/plot";

function main() {
  checkBase("water");
  setStirRounding(true);
  const delay = 300; // need more test
  logAddSunSalt(243);
  logSkirt();
  logAddSunSalt(14);
  logAddStirCauldron(4.55);
  console.log(getBottlePolarAngle());
  console.log(getCurrentStirDirection());
  const direction = getBottlePolarAngle();
  straighten(direction, "sun", { maxGrains: delay - 243 - 14 });
  logSkirt();
  straighten(direction, "sun", { maxGrains: 501 - delay });
  logAddStirCauldron(11);
  stirToTurn();
  logAddHeatVortex(2.5);
  heatAndPourToEdge(1, 10);
  derotateToAngle(-113);
  logAddHeatVortex(0.788); // Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 7);
  logAddHeatVortex(3.98); //Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.2, 24); // heavier continuous pour&stir save 1 more moon.
  logAddHeatVortex(0.15);
  logAddMoonSalt(61);
  stirToTurn(3.13); // roughly
  pourIntoVortex(13, 26);
  derotateToAngle(0.0);
  logAddHeatVortex(5.7);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(1.75); // Empirical
  stirToTier(Effects.Water.Invisibility, { preStirLength: 7.1 }); // roughly
  logAddPourSolvent(5.35); // Empirical
  let returnSalt = 280; // Empirical. Add less is not necessarily better.
  logAddSunSalt(returnSalt);
  stirToDangerZoneExit();
  logAddPourSolvent(1.63); // Empirical
  stirToDangerZoneExit();
  logAddPourSolvent(1.36); // Empirical
  stirIntoVortex();
  logAddHeatVortex(9.1); // Empirical
  pourIntoVortex(8, 16);
  logAddHeatVortex(Infinity);
  console.log(Math.ceil((180 + currentPlot.pendingPoints[0].angle) / 0.36) + 280);
  // predict 2nd part of sun salt
  straighten(degToRad(48), "sun", { maxGrains: 104 });
  // pass the skeleton
  const saltToReverse = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  // match the angle entering vortex.
  straighten(degToRad(-65.9), "sun", { maxGrains: saltToReverse });
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity(EntityVortex, false)));
  logAddHeatVortex(4.6);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(5.12);
  derotateToAngle(saltToDeg("moon", 100 + 33.3));
  straighten(degToRad(5), "sun", { maxGrains: 99, preStirLength: 9.5 });
  // last salt for precise centering
  logAddStirCauldron(1.286);
  logAddSunSalt(1);
  console.log(
    "path deviation: " + stirToNearestTarget(Effects.Water.Levitation, { preStirLength: 3.2 })
  );
}

function beta() {
  checkBase("water");
  setStirRounding(true);
  const delay = 300; // need more test
  logAddSunSalt(243);
  logSkirt();
  logAddSunSalt(14);
  logAddStirCauldron(4.55);
  console.log(getBottlePolarAngle());
  console.log(getCurrentStirDirection());
  const direction = getBottlePolarAngle();
  straighten(direction, "sun", { maxGrains: delay - 243 - 14 });
  logSkirt();
  straighten(direction, "sun", { maxGrains: 501 - delay });
  logAddStirCauldron(11);
  stirToTurn();
  logAddHeatVortex(2.5);
  heatAndPourToEdge(1, 10);
  derotateToAngle(-113);
  logAddHeatVortex(0.788); // Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.3, 7);
  logAddHeatVortex(3.98); //Empirical
  stirIntoVortex();
  heatAndPourToEdge(0.2, 24); // heavier continuous pour&stir save 1 more moon.
  logAddHeatVortex(0.15);
  logAddMoonSalt(61);
  stirToTurn(3.13); // roughly
  pourIntoVortex(13, 26);
  derotateToAngle(0.0);
  logAddHeatVortex(5.7);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(1.75); // Empirical
  stirToTier(Effects.Water.Invisibility, { preStirLength: 7.1 }); // roughly
  logAddPourSolvent(5.35); // Empirical
  let returnSalt = 280; // Empirical. Add less is not necessarily better.
  logAddSunSalt(returnSalt);
  stirToDangerZoneExit();
  logAddPourSolvent(1.63); // Empirical
  stirToDangerZoneExit();
  logAddPourSolvent(1.36); // Empirical
  stirIntoVortex();
  logAddHeatVortex(9.1); // Empirical
  pourIntoVortex(8, 16);
  logAddHeatVortex(Infinity);
  console.log(Math.ceil((180 + currentPlot.pendingPoints[0].angle) / 0.36) + 280);
  // predict 2nd part of sun salt
  straighten(degToRad(51), "sun", { maxGrains: 104 });
  // pass the skeleton
  const saltToReverse = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  // match the angle entering vortex.
  straighten(degToRad(-65.9), "sun", { maxGrains: saltToReverse });
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity(EntityVortex, false)));
  logAddHeatVortex(4.6);
  pourToEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(5.12);
  derotateToAngle(saltToDeg("moon", 100 + 33.3));
  logAddStirCauldron(9.5);
  straighten(degToRad(9), "sun", { maxGrains: 99 });
  // last salt for precise centering
  logAddStirCauldron(0.269);
  logAddSunSalt(1);
  console.log(
    "path deviation: " + stirToNearestTarget(Effects.Water.Levitation, { preStirLength: 4.5 })
  );
}
