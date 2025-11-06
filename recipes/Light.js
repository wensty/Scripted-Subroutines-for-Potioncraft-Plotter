import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTarget,
  derotateToAngle,
  degToRad,
  radToDeg,
  vecToDirCoord,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  straighten,
  getTotalSun,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Light",
    desc: "Light",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 234 },
    Effects: { Light: 1 },
    script: () => s1(),
  },
};

function s1() {
  checkBase("water");
  logAddSunSalt(20);
  logSkirt();
  logAddStirCauldron(5.25);
  logAddPourSolvent(Infinity);
  console.log("a1: " + radToDeg(getStirDirection()));
  stirIntoVortex(5.5);
  console.log("a2~a1: " + (radToDeg(getAngleEntity()) - 90));
  logAddHeatVortex(4.3);
  logAddPourSolvent(1.268);
  logAddHeatVortex(3.69);
  console.log("a3:" + (radToDeg(getHeatDirection()) - 90));
  straighten(degToRad(-51.25), SaltNames.Sun, { maxGrains: 210 - getTotalSun(), preStir: 4.5 });
  stirIntoVortex(4.7);
  console.log("a4~>a3: " + (radToDeg(getAngleEntity()) - 180));
  derotateToAngle(31.7, { toAngle: false });
  logAddHeatVortex(Infinity);
  const { x: x1, y: y1 } = currentPlot.pendingPoints[0];
  stirIntoVortex(4.3);
  const { x: x2, y: y2 } = currentPlot.pendingPoints[0];
  console.log("d1: " + radToDeg(vecToDirCoord(x2 - x1, y2 - y1)));
  console.log("d2~d1: " + radToDeg(vecToDirCoord(-26.28 - x1, 6.25 - y1)));
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1.36);
  stirToTarget(Effects.Water.Light, { preStir: 0.8, maxStir: 1.0 });
}
