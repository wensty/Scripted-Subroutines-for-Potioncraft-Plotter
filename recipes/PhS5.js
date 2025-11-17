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
  pourUntilAngle,
  degToRad,
  radToDeg,
  vecToDirCoord,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getCoord,
  setDisplay,
} from "../mainScript";
import { DeviationT1, Entity, SaltNames, BaseNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const PhS5 = {
  Healing: 1,
  WildGrowth: 1,
  Mana: 1,
  Light: 1,
  Libido: 1,
};

const recipes = {
  r1: {
    title: "PhS5",
    desc: "PhS5",
    version: 4,
    base: BaseNames.Water,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 1035 },
    Effects: PhS5,
    script: () => r1(),
  },
};

/**
 * Can be lowered to 1036 salt by saving 1.1 salt of angle when pouring back to origin for the second time.
 */
function r1() {
  checkBase(BaseNames.Water);
  logAddSunSalt(166);
  logSkirt();
  derotateToAngle(10.72, { toAngle: false });
  straighten(degToRad(45), SaltNames.Sun, { preStir: 5.0, maxGrains: 187 }); // minimal.
  logSkirt();
  stirToTurn({ preStir: 11.1 });
  console.log(radToDeg(getAngleEntity(Entity.PotionEffect)) + 180);
  logAddPourSolvent(Infinity);
  straighten(degToRad(149), SaltNames.Sun, { preStir: 11.2, maxGrains: 182 });
  stirIntoVortex(3.5);
  console.log(radToDeg(getAngleEntity()) + 180);
  heatAndPourToEdge(0.2, 14);
  logAddHeatVortex(3.644); // Empirical. To pour back.
  stirToTier(Effects.Water.WildGrowth, {
    preStir: 2.6,
    deviation: DeviationT1,
    ignoreAngle: true,
  });
  pourUntilAngle(0.01, { overPour: false }); // save 1 salt until reversed de-rotation.
  stirToTurn({ preStir: 3.07, directionBuffer: 0.0 });
  const { x: x1, y: y1 } = getCoord();
  console.log("d: " + vecToDirCoord(-5.49 - x1, 5.76 - y1));
  console.log("~d: " + getStirDirection());
  const s1 = 245;
  const d1 = -47.7;
  straighten(degToRad(d1), SaltNames.Sun, { maxGrains: s1 });
  console.log(stirIntoVortex());
  logAddStirCauldron(0.137); // to not die.
  console.log("~d1: " + radToDeg(getAngleEntity() - Math.PI));
  logAddHeatVortex(5.46);
  const d2 = -67.2;
  straighten(degToRad(d2), SaltNames.Sun, { preStir: 8.0, maxGrains: 445 - s1 });
  stirIntoVortex();
  console.log("~d2:" + radToDeg(getAngleEntity() - Math.PI));
  logAddHeatVortex(Infinity);
  const { x: x2, y: y2 } = getCoord();
  const d3 = vecToDirCoord(-26.28 - x2, 6.25 - y2);
  stirIntoVortex();
  console.log("d3: " + d3);
  console.log("~d3: " + (getAngleEntity() - Math.PI));
  logAddSunSalt(Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36));
  heatAndPourToEdge(3, 6);
  logAddHeatVortex(5.22);
  derotateToAngle(53, { toAngle: false });
  setDisplay();
  stirToTarget(Effects.Water.Libido, { preStir: 5.5, maxStir: 0.6 });
  logAddPourSolvent(1.5);
  logAddStirCauldron(4);
  logAddPourSolvent(5);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1);
}
