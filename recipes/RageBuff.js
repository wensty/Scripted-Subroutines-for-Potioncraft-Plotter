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
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  vecToDirCoord,
  checkBase,
  straighten,
  getSun,
  setStirRounding,
} from "../mainScript";
import { DeviationT1, Effects } from "../mainScript";

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
  logAddSunSalt(501 - getSun());
  heatAndPourToEdge(3, 5); // 3 empirical instruction.
  logAddHeatVortex(5.76);
  derotateToAngle(-95.5);
  stirToTier(Effects.Water.Dexterity, { deviation: DeviationT1, ignoreAngle: true });

  logAddPourSolvent(5.7);
  stirToDangerZoneExit();
  logAddPourSolvent(6.4);
  stirToDangerZoneExit();
  logAddPourSolvent(6.45);

  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  straighten(degToRad(-135), "sun", { preStir: 0.2, maxGrains: 120 });
  stirIntoVortex();
  derotateToAngle(0);
  logAddHeatVortex(5);
  pourToVortexEdge();
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
  straighten(vecToDirCoord(x2 - x1, y2 - y1), "sun", { maxGrains: 94 });
  stirIntoVortex();
  derotateToAngle(96.5);
  logAddHeatVortex(Infinity);
  straighten(degToRad(-120), "sun", { maxGrains: 49 });
  stirToTier(Effects.Water.Rage, {
    preStir: 5.0,
    deviation: DeviationT1,
    ignoreAngle: true,
  });
}
