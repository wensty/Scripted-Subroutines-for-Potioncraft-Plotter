import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToTarget,
  stirToTier,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  getAngleEntity,
  checkBase,
  straighten,
} from "../mainScript";
import { DeviationT1, Entity, SaltNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

/**
 * Can be lowered to 1036 salt by saving 1.1 salt of angle when pouring back to origin for the second time.
 */
function beta() {
  checkBase("water");
  logAddSunSalt(166);
  logSkirt();
  derotateToAngle(10.04, { toAngle: false });
  straighten(degToRad(41.5), SaltNames.Sun, { preStir: 5.0, maxGrains: 187 });
  logSkirt();
  stirToTier(Effects.Water.Mana, {
    preStir: 10.8,
    deviation: DeviationT1,
    ignoreAngle: true,
  });
  console.log(radToDeg(Math.PI + getAngleEntity(Entity.PotionEffect)));
  logAddPourSolvent(Infinity);
  straighten(degToRad(149), SaltNames.Sun, { preStir: 11.2, maxGrains: 184 });
  stirIntoVortex(3.5);
  console.log(radToDeg(getAngleEntity()) + 180);
  heatAndPourToEdge(0.2, 14);
  logAddHeatVortex(3.35); // Empirical
  console.log(getAngleEntity());
  stirToTier(Effects.Water.WildGrowth, {
    preStir: 1.7,
    deviation: DeviationT1,
    ignoreAngle: true,
  });
  console.log(getAngleEntity(Entity.PotionEffect) + Math.PI);

  // section 2
  stirToTurn({ preStirLength: 3.25, directionBuffer: 0.0 }); // Empirical
  straighten(degToRad(-45), SaltNames.Sun, { maxStir: 0.85, maxGrains: 250 });
  stirIntoVortex();
  logAddStirCauldron(0.13); // to not die.
  console.log(radToDeg(getAngleEntity()) - 180);
  logAddHeatVortex(5.8);
  stirToTurn({ preStirLength: 7.0 });
  straighten(degToRad(-73), SaltNames.Sun, { maxGrains: 190 });
  stirIntoVortex();
  console.log(radToDeg(getAngleEntity()) - 180);
  logAddHeatVortex(Infinity);
  stirIntoVortex();
  logAddSunSalt(Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36));
  heatAndPourToEdge(3, 6);
  logAddHeatVortex(5.3);
  derotateToAngle(50, { toAngle: false });
  stirToTarget(Effects.Water.Libido, { preStir: 5.7, maxStir: 0.3 });
  logAddPourSolvent(1.5);
  logAddStirCauldron(4);
  logAddPourSolvent(5);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1);
}
