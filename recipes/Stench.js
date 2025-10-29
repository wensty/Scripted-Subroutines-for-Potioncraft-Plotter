import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  stirToConsume,
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  saltToDeg,
  vecToDirCoord,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  checkBase,
  straighten,
  getTotalSun,
  setDisplay,
} from "../mainScript";
import { SaltType, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Stench",
    desc: "LifeSalt theory: 76+137.",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { PhantomSkirt: 2 },
    Salts: { MoonSalt: 13, SunSalt: 1819, LifeSalt: 213 },
    script: () => {
      checkBase("water");
      setDisplay(false);
      logSkirt();
      logAddSunSalt(245);
      logAddStirCauldron(4.55);
      // console.log(getCurrentStirDirection())
      const a1 = getAngleOrigin();
      console.log(getAngleOrigin());
      const adv = 106; // maybe 107.
      straighten(a1, SaltType.Sun, { maxGrains: 501 - adv - getTotalSun() });
      logSkirt();
      straighten(a1, SaltType.Sun, { maxGrains: adv });
      stirIntoVortex();
      console.log(getAngleEntity() - Math.PI);
      derotateToAngle(saltToDeg("sun", 191), { toAngle: false });
      logAddHeatVortex(Infinity);
      stirIntoVortex(3.1);
      heatAndPourToEdge(0.3, 4);
      logAddHeatVortex(4.02);
      stirToTurn({ preStirLength: 5.5 });
      const a = -123;
      straighten(degToRad(a), SaltType.Sun, { maxGrains: 389 });
      const { x: x1, y: y1 } = currentPlot.pendingPoints[0];
      logAddStirCauldron(9.8);
      const { x: x2, y: y2 } = currentPlot.pendingPoints[0];
      console.log(getStirDirection());
      console.log(vecToDirCoord(x2 - x1, y2 - y1));
      console.log(degToRad(a));
      straighten(degToRad(a), SaltType.Sun, { maxGrains: 300, maxStir: 0.73 });
      logAddSunSalt(Math.ceil((currentPlot.pendingPoints[0].angle + 180.01) / 0.36));
      logAddSunSalt(0);
      logAddPourSolvent(0.9);
      stirToZone({ overStir: true, exitZone: true });
      logAddPourSolvent(1.17);
      stirToZone({ overStir: true, exitZone: true });
      logAddPourSolvent(1.35);
      stirToZone({ overStir: true, exitZone: true });
      logAddPourSolvent(0.9);
      stirToZone({ overStir: true, exitZone: true });
      stirToTurn();
      logAddHeatVortex(1);
      logAddPourSolvent(2);
      derotateToAngle(0);
      // logAddStirCauldron(2)
      stirToConsume(2.9);
      pourToVortexEdge();
      heatAndPourToEdge(1, 6);
      logAddHeatVortex(2.8);
      straighten(degToRad(-115), SaltType.Sun, { maxGrains: 130 });
      stirIntoVortex(5);
      logAddStirCauldron(0.43);
      logAddHeatVortex(Infinity);
      logAddPourSolvent(0.776);
      logAddSunSalt(5);
      stirToTurn();
      straighten(degToRad(-112), SaltType.Sun, { maxStir: 2.5, maxGrains: 353 });
      stirToDangerZoneExit();
      console.log(currentPlot.committedPoints[currentPlot.committedPoints.length - 3].health);
      logAddMoonSalt(13);
      stirToZone({ preStir: 4, overStir: false });
      logAddSunSalt(28);
      // stirToDangerZoneExit(2)
      // console.log(currentPlot.ommittedPoints[currentPlot.committedPoints.length-3].health)
      stirIntoVortex(5);
      derotateToAngle(-135);
      logAddHeatVortex(4.435);
      console.log(stirToTarget(Effects.Water.Stench, { preStir: 3.3, maxStir: 0.5 }));
    },
  },
};
