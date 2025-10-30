import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  pourToZoneV2,
  degToRad,
  vecToDir,
  vecToDirCoord,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  vSub,
  getCoord,
  getTotalSun,
} from "../mainScript";
import { Entity, SaltType } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "FireProtection",
    desc: "",
    version: 3,
    base: "oil",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 834 },
    script: r1,
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
  straighten(a1 - Math.PI / 2, SaltType.Sun, { maxGrains: 129 });
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
  straighten(vecToDir(vSub(p2, p1)), SaltType.Sun, { maxGrains: 501 - getTotalSun() });
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
  straighten(d - degToRad(0), SaltType.Sun, {
    maxGrains: 834 - getTotalSun(),
  });
  logAddStirCauldron(Infinity);
}
