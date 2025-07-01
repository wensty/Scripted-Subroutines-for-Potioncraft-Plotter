import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTier,
  pourToEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  getDirectionByVector,
  checkBase,
  straighten,
  getTotalSun,
  setStirRounding,
} from "../main";
import { DeviationT1, Effects } from "../main";

import { currentPlot } from "@potionous/plot";

function bete() {
  checkBase("water");
  setStirRounding(true);
  logSkirt();
  logSkirt();
  logAddStirCauldron(5);
  logAddSunSalt(40);
  logAddSunSalt(263 - 40);
  stirIntoVortex();
  stirToTurn();
  logAddSunSalt(501 - getTotalSun());
  heatAndPourToEdge(3, 5); // 3 empirical instruction.
  logAddHeatVortex(5.76);
  derotateToAngle(-95.5);
  stirToTier(Effects.Water.Dexterity, { maxDeviation: DeviationT1, ignoreAngle: true });

  logAddPourSolvent(5.7);
  stirToDangerZoneExit();
  logAddPourSolvent(6.4);
  stirToDangerZoneExit();
  logAddPourSolvent(6.45);

  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  straighten(degToRad(-135), "sun", { preStirLength: 0.2, maxGrains: 120 });
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(5);
  pourToEdge();
  heatAndPourToEdge(3, 5);
  logAddPourSolvent(2.6);
  stirIntoVortex();
  logAddPourSolvent(Infinity);

  logAddStirCauldron(3.2);
  logAddPourSolvent(Infinity);
  stirIntoVortex();
  logAddHeatVortex(5);
  logAddPourSolvent(1.2);
  logAddHeatVortex(Infinity);

  logAddSunSalt(85);
  logAddStirCauldron(2.5);
  logAddSunSalt(109);
  const x1 = currentPlot.pendingPoints[0].x;
  const y1 = currentPlot.pendingPoints[0].y;
  stirToTurn();
  const x2 = currentPlot.pendingPoints[0].x;
  const y2 = currentPlot.pendingPoints[0].y;
  straighten(getDirectionByVector(x2 - x1, y2 - y1), "sun", { maxGrains: 94 });
  stirIntoVortex();
  derotateToAngle(96.5);
  logAddHeatVortex(Infinity);
  straighten(degToRad(-120), "sun", { maxGrains: 49 });
  stirToTier(Effects.Water.Rage, {
    preStirLength: 5.0,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
}
