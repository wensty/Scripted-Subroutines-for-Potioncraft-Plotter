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
  stirToTarget,
  stirToTier,
  pourToVortexEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  derotateToAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getTotalSun,
  setStirRounding,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const MST2 = {
  Invisibility: 2,
  Levitation: 3,
};

const recipes = {
  r1: {
    title: "Invisitation(MST2)",
    desc: "501+597+100=1198",
    version: 3,
    base: "water",
    Ingredients: { PhantomSkirt: 2 },
    Salts: { MoonSalt: 60, SunSalt: 1198 },
    Effects: MST2,
    script: () => r1(),
  },
};

function r1() {
  checkBase("water");
  setStirRounding(true);
  const delay = 300; // need more test
  logAddSunSalt(243);
  logSkirt();
  logAddSunSalt(14);
  logAddStirCauldron(4.55);
  console.log(getAngleOrigin());
  console.log(getStirDirection());
  const direction = getAngleOrigin();
  straighten(direction, SaltNames.Sun, { maxGrains: delay - getTotalSun() });
  logSkirt();
  straighten(direction, SaltNames.Sun, { maxGrains: 501 - getTotalSun() }); // first part: 501 sun
  stirToTurn({ preStir: 11 });
  logAddHeatVortex(2.5);
  heatAndPourToEdge(1, 10);
  derotateToAngle(-113);
  logAddHeatVortex(0.804); // Empirical
  stirIntoVortex(6.4);
  heatAndPourToEdge(0.268, 8);
  logAddHeatVortex(4.004); // Empirical
  stirIntoVortex(1.8);
  heatAndPourToEdge(0.2, 24);
  logAddHeatVortex(0.15);
  logAddMoonSalt(60);
  stirToTurn({ preStir: 3.13 });
  pourIntoVortex(13, 26);
  derotateToAngle(0.0);
  logAddHeatVortex(5.7);
  pourToVortexEdge();
  heatAndPourToEdge(1, 9);
  logAddHeatVortex(1.75); // Empirical
  stirToTier(Effects.Water.Invisibility, { preStir: 7.1 }); // roughly
  logAddPourSolvent(5.33); // Empirical
  let returnSalt = 280; // Empirical. Add less is not necessarily better.
  logAddSunSalt(returnSalt);
  stirToDangerZoneExit(1.0);
  logAddPourSolvent(1.63); // Empirical
  stirToDangerZoneExit(0.4);
  logAddPourSolvent(1.36); // Empirical
  stirIntoVortex();
  logAddHeatVortex(9.1); // Empirical
  pourIntoVortex(8, 16);
  logAddHeatVortex(Infinity);
  console.log(Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36) + returnSalt);
  // predict 2nd part of sun salt
  straighten(degToRad(48.9), SaltNames.Sun, { maxGrains: 104 });
  // pass the skeleton
  const saltToReverse = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  // match the angle entering vortex.
  straighten(degToRad(-65.7), SaltNames.Sun, { preStir: 10.9, maxGrains: saltToReverse });
  stirIntoVortex();
  console.log(radToDeg(getAngleEntity()) - 180);
  logAddHeatVortex(4.6);
  pourToVortexEdge();
  heatAndPourToEdge(1, 5);
  logAddHeatVortex(5.14);
  derotateToAngle(saltToDeg(SaltNames.Moon, 100) - 11.99); // last part: expanding the path.
  logAddStirCauldron(9.5);
  straighten(degToRad(14), SaltNames.Sun, { maxGrains: 99 });
  logAddStirCauldron(0.682);
  logAddSunSalt(1);
  console.log(stirToTarget(Effects.Water.Levitation, { preStir: 4.3 }).distance);
}
