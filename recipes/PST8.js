import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToVortexEdge,
  stirToTurn,
  stirToTier,
  pourToVortexEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  derotateToAngle,
  degToRad,
  radToDeg,
  getAngleVortex,
  getAngleEffect,
  getStirDirection,
  getHeatDirection,
  checkBase,
  getAngle,
  straighten,
  getSun,
  getStir,
} from "../mainScript";
import { DeviationT1, SaltNames, BaseNames, Effects } from "../mainScript";

import { currentRecipeItems } from "@potionous/plot";

// sun: 525
function r1() {
  checkBase(BaseNames.Water);
  // lightning

  const s1 = 110;
  logAddSunSalt(s1);
  logSkirt();
  logSkirt();
  straighten(degToRad(10), SaltNames.Sun, { preStir: 4.7, maxGrains: 131 });
  straighten(degToRad(10), SaltNames.Sun, { preStir: 10.0, maxGrains: 501 - getSun() });
  stirIntoVortex(2.0);
  stirToVortexEdge();
  logAddHeatVortex(3.8);
  stirToVortexEdge(1.2);

  logAddHeatVortex(0.4);
  stirToTier(Effects.Water.Lightning, { deviation: DeviationT1, ignoreAngle: true });
  pourIntoVortex(8, 16);
  console.log(getAngle());

  // explosion

  logAddHeatVortex(4);
  stirToTurn({ preStir: 28.83 - getStir(), directionBuffer: 0 });
  logAddHeatVortex(Infinity);
  logAddPourSolvent(6.42); // by experiment
  const d1 = getStirDirection();
  stirIntoVortex(2.8);
  const d2 = getAngleVortex();
  console.log("d1:" + d1);
  console.log("~>d1:" + (d2 - Math.PI / 2));
  console.log(getStir());

  logAddHeatVortex(5.15);
  logAddPourSolvent(0.3);
  logAddHeatVortex(1.3);
  logAddPourSolvent(1.62);
  logAddHeatVortex(4.2);
  const d3 = getHeatDirection();
  stirToTier(Effects.Water.Explosion, { deviation: DeviationT1, ignoreAngle: true, preStir: 5.8 });
  const d4 = getAngleEffect();
  console.log("d3:" + d3);
  console.log("~d3:" + (d4 - Math.PI / 2));

  // fire + poison

  logAddPourSolvent(6.88);
  logAddHeatVortex(5.5);
  pourToVortexEdge();
  heatAndPourToEdge(0.43, 7);
  logAddHeatVortex(0.42);
  stirIntoVortex(10.5);
  logAddStirCauldron(0.497);
  logAddHeatVortex(Infinity);
  stirToTurn();
  logAddPourSolvent(7.37);
  stirToTurn();

  logAddPourSolvent(0.97);
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  stirIntoVortex(1.3);
  console.log(getStir());
  logAddHeatVortex(5);
  derotateToAngle(0);

  // wild growth

  const target = 24;
  stirToTurn({ preStir: 0, directionBuffer: 0 });
  pourToVortexEdge();
  heatAndPourToEdge(1, 7);
  logAddHeatVortex(0.13);
  console.log(
    "total stir:" +
      currentRecipeItems
        .filter((x) => x.type == "stir-cauldron")
        .map((x) => x.distance)
        .reduce((x, y) => x + y, 0)
  );
  const d5 = radToDeg(getHeatDirection());
  straighten(degToRad(d5 - 90), SaltNames.Sun, { maxGrains: target });
  stirIntoVortex(1.9);
  const d6 = radToDeg(getAngleVortex());
  console.log("d1:" + d5);
  console.log("~d1:" + (d6 + 270));

  logAddHeatVortex(2.74);
  pourToVortexEdge();
  heatAndPourToEdge(0.2, 18);
  for (let i = 0; i < 17; i++) {
    logAddHeatVortex(0.2);
    stirToVortexEdge();
  }
}
