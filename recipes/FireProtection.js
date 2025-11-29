import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToVortexEdge,
  stirToTurn,
  stirToTarget,
  pourToVortexEdge,
  heatAndPourToEdge,
  pourToZoneV2,
  derotateToAngle,
  degToRad,
  vecToDir,
  vecToDirCoord,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  straighten,
  vSub,
  getCoord,
  getSun,
  setVirtual,
  unsetVirtual,
} from "../mainScript";
import { Entity, SaltNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const StrongFireProtection = { FireProtection: 3 };
const FireProtection = { FireProtection: 2 };
const WeakFireProtection = { FireProtection: 1 };

const recipes = {
  r1: {
    title: "FireProtection",
    desc: "",
    version: 3,
    base: "oil",
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 834 },
    Effects: StrongFireProtection,
    script: r1,
  },
  r2: {
    title: "FireProtection",
    desc: "",
    version: 3,
    base: "water",
    Ingredients: { PhantomSkirt: 2 },
    Salts: { SunSalt: 1002 },
    Effects: StrongFireProtection,
    script: r2,
  },
};

function r1() {
  checkBase("oil");
  logSkirt();
  logAddStirCauldron(4.55);
  const a1 = getAngleOrigin();
  console.log(a1);
  console.log(getStirDirection());
  logAddPourSolvent(1.85);
  straighten(a1 - Math.PI / 2, SaltNames.Sun, { maxGrains: 129 });
  const d1 =
    vecToDirCoord(3.88 - currentPlot.pendingPoints[0].x, 4.15 - currentPlot.pendingPoints[0].y) +
    Math.PI / 2;
  console.log(d1);
  stirIntoVortex();
  console.log(getAngleEntity() + Math.PI * 1.5);
  // Part 2
  logAddHeatVortex(Infinity);
  const p1 = getCoord();
  logAddSunSalt(264);
  stirToTurn({ preStir: 8.3 });
  const p2 = getCoord();
  straighten(vecToDir(vSub(p2, p1)), SaltNames.Sun, { maxGrains: 501 - getSun() });
  console.log(stirToTurn({ preStir: 0.5 }));
  const a2 = getAngleOrigin();
  console.log("a2: " + a2);
  logAddPourSolvent(1.076);
  console.log("~a2: " + getStirDirection());
  stirToTurn({ preStir: 0.5 });
  logAddPourSolvent(2.732);
  console.log("~a2: " + getStirDirection());
  stirToTurn({});
  pourToZoneV2({ zone: Entity.Swamp, maxPour: 1.0 });
  for (let i = 0; i < 14; i++) {
    logAddStirCauldron(0.05);
    pourToZoneV2({ zone: Entity.Swamp, maxPour: 0.2 });
  } // turning point.
  logAddSunSalt(33);
  for (let i = 0; i < 26; i++) {
    logAddStirCauldron(0.05);
    pourToZoneV2({ zone: Entity.Swamp, maxPour: 0.2 });
  }
  // Part 3
  const p3 = getCoord();
  logAddSunSalt(0);
  logAddStirCauldron(8.5);
  const p4 = getCoord();
  const d = vecToDir(vSub(p4, p3));
  console.log("a3: " + d);
  console.log("~a3: " + getStirDirection());
  straighten(d - degToRad(0), SaltNames.Sun, {
    maxGrains: 834 - getSun(),
  });
  logAddStirCauldron(Infinity);
}

function r2() {
  checkBase("water");
  logSkirt();
  logAddStirCauldron(5.2);
  logAddSunSalt(267);
  stirToTurn({ preStir: 11.5 });
  logAddHeatVortex(4);
  stirToVortexEdge(0.6);
  logAddHeatVortex(1.868);
  logAddSunSalt(190);
  console.log(stirIntoVortex(5.8));
  logAddSunSalt(44);
  derotateToAngle(100 * 0.36, { toAngle: false });
  logAddHeatVortex(Infinity);
  logAddStirCauldron(5);
  const pre = -36.5;
  derotateToAngle(pre);
  logSkirt();
  derotateToAngle(-36.3);
  logAddHeatVortex(Infinity);
  console.log(stirIntoVortex(6.4));
  logAddHeatVortex(2.74);
  console.log(stirIntoVortex(12));
  derotateToAngle(0);
  heatAndPourToEdge(3, 7);
  logAddHeatVortex(3);
  stirToVortexEdge();
  logAddHeatVortex(2.5);
  logAddSunSalt(153);
  stirIntoVortex(0.7);
  logAddHeatVortex(Infinity);
  logAddSunSalt(205);
  stirIntoVortex(0.9);
  logAddSunSalt(1002 - getSun());
  derotateToAngle(21.5, { toAngle: false });
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1.53);
  console.log(getAngleOrigin());
  const { x, y } = getCoord();
  console.log(vecToDirCoord(43.02 - x, 22.83 - y) - Math.PI / 2);
  console.log(stirIntoVortex(1.8));
  console.log(getAngleEntity() + Math.PI / 2);
  logAddHeatVortex(0.4);
  pourToVortexEdge();
  heatAndPourToEdge(0.3, 5);
  logAddHeatVortex(4.9);
  console.log(getAngleOrigin());
  console.log(getHeatDirection() + Math.PI);
  derotateToAngle(34.1, { toAngle: false });
  logAddPourSolvent(5);
  console.log(stirIntoVortex(6.2));
  derotateToAngle(50.647, { toAngle: false });
  logAddHeatVortex(Infinity);
  console.log(stirToTarget(Effects.Water.FireProtection, { preStir: 5.1 }).distance);
}
