import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToNearestTarget,
  stirToTier,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  getBottlePolarAngleByEntity,
  checkBase,
  straighten,
} from "../main";
import { DeviationT1, Entity, Salt, Effects } from "../main";

import { currentPlot } from "@potionous/plot";

function beta() {
  checkBase("water");
  logAddSunSalt(166);
  logSkirt();
  derotateToAngle(10.04, { toAngle: false });
  straighten(degToRad(41.5), Salt.Sun, { preStirLength: 5.0, maxGrains: 187 });
  logSkirt();
  stirToTier(Effects.Water.Mana, {
    preStirLength: 10.8,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
  console.log(radToDeg(Math.PI + getBottlePolarAngleByEntity(Entity.PotionEffect)));
  logAddPourSolvent(Infinity);
  straighten(degToRad(149), Salt.Sun, { preStirLength: 11.2, maxGrains: 184 });
  stirIntoVortex(3.5);
  console.log(radToDeg(getBottlePolarAngleByEntity()) + 180);
  heatAndPourToEdge(0.2, 14);
  logAddHeatVortex(3.35); // Empirical
  console.log(getBottlePolarAngleByEntity());
  stirToTier(Effects.Water.WildGrowth, {
    preStirLength: 1.7,
    maxDeviation: DeviationT1,
    ignoreAngle: true,
  });
  console.log(getBottlePolarAngleByEntity(Entity.PotionEffect) + Math.PI);
  logAddPourSolvent(Infinity);
  // section 2
  stirToTurn({ preStirLength: 3.25, directionBuffer: 0.0 }); // Empirical
  straighten(degToRad(-45), Salt.Sun, { maxStirLength: 0.85, maxGrains: 250 });
  stirIntoVortex();
  logAddStirCauldron(0.13); // to not die.
  console.log(radToDeg(getBottlePolarAngleByEntity()) - 180);
  logAddHeatVortex(5.8);
  stirToTurn({ preStirLength: 7.0 });
  straighten(degToRad(-73), Salt.Sun, { maxGrains: 190 });
  stirIntoVortex();
  console.log(radToDeg(getBottlePolarAngleByEntity()) - 180);
  logAddHeatVortex(Infinity);
  stirIntoVortex();
  logAddSunSalt(Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36));
  heatAndPourToEdge(3, 6);
  logAddHeatVortex(5.3);
  derotateToAngle(50, { toAngle: false });
  stirToNearestTarget(Effects.Water.Libido, { preStirLength: 5.7, maxStirLength: 0.3 });
  logAddPourSolvent(1.5);
  logAddStirCauldron(4);
  logAddPourSolvent(5);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1);
}
