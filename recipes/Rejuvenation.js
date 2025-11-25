import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  pourToVortexEdge,
  heatAndPourToEdge,
  pourToZoneV2,
  derotateToAngle,
  pourUntilAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  vecToDirCoord,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getSun,
  setDisplay,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const StrongRejuvenation = { Rejuvenation: 3 };

const recipes = {
  r1: {
    title: "Rejuvenation",
    desc: "1149=501+181+467",
    version: 3,
    base: BaseNames.Water,
    Ingredients: { PhantomSkirt: 3 },
    Salts: { SunSalt: 1149 },
    Effects: StrongRejuvenation,
    script: r1,
  },
  r2: {
    title: "Rejuvenation",
    desc: "1161=548+501+112",
    version: 3,
    base: BaseNames.Oil,
    Ingredients: { PhantomSkirt: 2 },
    Salts: { SunSalt: 1161 },
    Effects: StrongRejuvenation,
    script: r2,
  },
};

function r1() {
  checkBase(BaseNames.Water);
  logSkirt();
  logAddSunSalt(350);
  logAddStirCauldron(5);
  logAddSunSalt(120);
  logAddStirCauldron(6);
  logAddHeatVortex(Infinity);
  stirToTurn({ preStir: 5.3 });
  logAddSunSalt(501 - getSun());
  const a1 = 37;
  derotateToAngle(-a1, { toAngle: true });
  logSkirt();
  logSkirt();
  derotateToAngle(-33.3, { toAngle: true });
  logAddHeatVortex(Infinity);
  stirIntoVortex(12.5);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddSunSalt(49);
  straighten(degToRad(120), SaltNames.Sun, { preStir: 9.0, maxGrains: 72 });
  stirToDangerZoneExit(3.3);
  pourToVortexEdge();
  heatAndPourToEdge(0.2, 7);
  logAddHeatVortex(0.052);
  stirToZone();
  logAddSunSalt(43);
  stirToDangerZoneExit(2);
  logAddSunSalt(17);
  stirIntoVortex(1);
  logAddStirCauldron(0.345);
  logAddHeatVortex(4);
  logAddPourSolvent(1);
  derotateToAngle(0);
  logAddHeatVortex(1);
  stirToTurn({ preStir: 2.6 });
  logAddHeatVortex(Infinity);
  logAddStirCauldron(10);
  logAddHeatVortex(Infinity);
  logAddStirCauldron(10.9);
  logAddSunSalt(74);
  stirToDangerZoneExit();
  logAddSunSalt(155);
  stirToDangerZoneExit();
  logAddSunSalt(36);
  stirToTurn({ preStir: 4.5 });
  logAddSunSalt(201);
  logAddHeatVortex(5);
  logAddStirCauldron(5.439);
  logAddSunSalt(1);
  stirToTarget(Effects.Water.Rejuvenation, { preStir: 5.0, maxStir: 1.0 });
}

function r2() {
  checkBase(BaseNames.Oil);
  logSkirt();
  logAddSunSalt(117);
  logAddStirCauldron(4.55);
  const a1 = getAngleOrigin();
  const a2 = getStirDirection();
  console.log("a1: " + a1);
  console.log("a2~a1: " + a2);
  const pre = 153; // The timing of second skirt.
  straighten(a1, SaltNames.Sun, { maxGrains: pre - getSun() });
  logSkirt();
  straighten(a1, SaltNames.Sun, { maxGrains: 453 - getSun() });
  stirToTurn({ preStir: 9.5 });
  const a3 = getAngleOrigin();
  console.log("a3: " + a3);
  straighten(a1, SaltNames.Sun, { maxGrains: 501 - getSun() });
  const a4 = getStirDirection();
  pourUntilAngle(saltToDeg(SaltNames.Moon, 499 - (a1 - a4) / (Math.PI / 500)));
  stirToTurn();
  pourToZoneV2({ exitZone: true, overPour: true });
  logAddPourSolvent(0.2);
  straighten(a1, SaltNames.Sun, { maxGrains: 47 });
  logAddStirCauldron(10.4);
  logAddHeatVortex(2.5);
  pourToVortexEdge();
  heatAndPourToEdge(1, 5);
  derotateToAngle(0);
  logAddHeatVortex(3.38);
  stirToZone({ preStir: 2.0, exitZone: true, overStir: true });
  logAddSunSalt(127);
  stirToZone({ preStir: 2.3, exitZone: true, overStir: true });
  const { x: x1, y: y1 } = currentPlot.pendingPoints[0];
  logAddSunSalt(113);
  stirToTurn();
  logAddSunSalt(pre);
  stirToZone({ preStir: 1.4, exitZone: true, overStir: true });
  straighten(degToRad(-178.6), SaltNames.Sun, {
    preStir: 2.8,
    maxGrains: Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36),
  });
  const { x: x2, y: y2 } = currentPlot.pendingPoints[0];
  console.log(radToDeg(vecToDirCoord(x2 - x1, y2 - y1)));
  stirIntoVortex(5.9);
  console.log(radToDeg(getAngleEntity()) - 180);
  logAddHeatVortex(3);
  pourToVortexEdge();
  heatAndPourToEdge(1, 9);
  const las = 112;
  derotateToAngle(saltToDeg(SaltNames.Moon, las - 0.1) - 12);
  logAddHeatVortex(4.8);
  straighten(degToRad(153), SaltNames.Sun, { preStir: 4, maxGrains: las - 1 });
  logAddStirCauldron(1.6);
  logAddSunSalt(1);
  stirToTarget(Effects.Oil.Rejuvenation, { preStir: 9.3, maxStir: 0.5 });
}
