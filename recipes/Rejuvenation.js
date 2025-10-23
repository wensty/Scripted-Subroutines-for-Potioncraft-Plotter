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
  stirToNearestTarget,
  pourToVortexEdge,
  heatAndPourToEdge,
  pourToZoneV2,
  derotateToAngle,
  pourUntilAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  getDirectionByVector,
  getBottlePolarAngle,
  getBottlePolarAngleByEntity,
  getCurrentStirDirection,
  checkBase,
  straighten,
  getTotalSun,
  setDisplay,
} from "../mainScript";
import { Salt, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Rejuvenation",
    desc: `
    1149=501+181+467
    `,
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: {
      PhantomSkirt: 3,
    },
    Salts: {
      SunSalt: 1149,
    },
    script: () => {
      checkBase("water");
      logSkirt();
      logAddSunSalt(350);
      logAddStirCauldron(5);
      logAddSunSalt(120);
      logAddStirCauldron(6);
      logAddHeatVortex(Infinity);
      stirToTurn({ preStirLength: 5.3 });
      logAddSunSalt(501 - getTotalSun());
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
      straighten(degToRad(120), Salt.Sun, { preStir: 9, maxGrains: 72 });
      stirToDangerZoneExit(3.3);
      pourToVortexEdge();
      heatAndPourToEdge(0.2, 7);
      logAddHeatVortex(0);
      logAddStirCauldron(3.15);
      logAddSunSalt(42);
      stirToDangerZoneExit(2);
      logAddSunSalt(18);
      stirIntoVortex(1);
      logAddStirCauldron(0.345);
      logAddHeatVortex(4);
      logAddPourSolvent(1);
      derotateToAngle(0);
      logAddHeatVortex(1);
      stirToTurn({ preStirLength: 2.7 });
      logAddHeatVortex(Infinity);
      logAddStirCauldron(10);
      logAddHeatVortex(Infinity);
      logAddStirCauldron(10.9);
      logAddSunSalt(74);
      stirToDangerZoneExit();
      logAddSunSalt(155);
      stirToDangerZoneExit();
      logAddSunSalt(36);
      stirToTurn({ preStirLength: 4.5 });
      logAddSunSalt(201);
      logAddHeatVortex(5);
      logAddStirCauldron(5.396);
      logAddSunSalt(1);
      stirToNearestTarget(Effects.Water.Rejuvenation, { preStir: 5.2, maxStir: 0.5 });
    },
  },
  r2: {
    title: "Rejuvenation",
    desc: `
    1162=548+501+113. 1161 possible in real game.
    `,
    version: 3,
    base: "oil",
    tier: 3,
    Ingredients: {
      PhantomSkirt: 2,
    },
    Salts: {
      SunSalt: 1162,
    },
    script: () => {
      checkBase("oil");
      logSkirt();
      logAddSunSalt(117);
      logAddStirCauldron(4.55);
      const a1 = getBottlePolarAngle(true);
      const a2 = getCurrentStirDirection();
      console.log(a1);
      console.log(a2);
      const pre = 154;
      straighten(a1, Salt.Sun, { maxGrains: pre - getTotalSun() });
      logSkirt();
      straighten(a1, Salt.Sun, { maxGrains: 453 - getTotalSun() });
      stirToTurn({ preStirLength: 9.5 });
      const a3 = getBottlePolarAngle();
      console.log(a3);
      straighten(a1, Salt.Sun, { maxGrains: 501 - getTotalSun() });
      const a4 = getCurrentStirDirection();
      console.log(a4);
      // console.log(saltToDeg("moon",499-(a1-a4)/(Math.PI/500)))
      pourUntilAngle(saltToDeg("moon", 499 - (a1 - a4) / (Math.PI / 500)));
      stirToTurn();
      pourToZoneV2({ exitZone: true, overPour: true });
      logAddPourSolvent(0.2);
      straighten(a1, Salt.Sun, { maxGrains: 47 });
      logAddStirCauldron(10.4);
      logAddHeatVortex(2.5);
      pourToVortexEdge();
      heatAndPourToEdge(1, 5);
      derotateToAngle(0);
      logAddHeatVortex(3.38);
      stirToZone({ preStirLength: 2.0, exitZone: true, overStir: true });
      logAddSunSalt(128);
      stirToZone({ preStirLength: 2.3, exitZone: true, overStir: true });
      // stirToZone()
      const { x: x1, y: y1 } = currentPlot.pendingPoints[0];
      logAddSunSalt(116);
      stirToTurn();
      logAddSunSalt(pre);
      stirToZone({ preStirLength: 1.4, exitZone: true, overStir: true });
      // logAddSunSalt(47)
      straighten(degToRad(-177.2), Salt.Sun, {
        preStir: 2.8,
        maxGrains: Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36),
      });
      const { x: x2, y: y2 } = currentPlot.pendingPoints[0];
      setDisplay(false);
      console.log(radToDeg(getDirectionByVector(x2 - x1, y2 - y1)));
      stirIntoVortex(5.9);
      console.log(radToDeg(getBottlePolarAngleByEntity()) - 180);
      logAddHeatVortex(3);
      pourToVortexEdge();
      heatAndPourToEdge(1, 9);
      const las = 113;
      derotateToAngle(saltToDeg("moon", las - 0.1) - 12);
      logAddHeatVortex(5.04);
      straighten(degToRad(153), Salt.Sun, { preStir: 4, maxGrains: las - 1 });
      logAddStirCauldron(1.31); // centering. Empirical.
      logAddSunSalt(1);
      setDisplay(true);
      stirToNearestTarget(Effects.Oil.Rejuvenation, { preStir: 9.6 });
    },
  },
};
