import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  logAddSetPosition,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTarget,
  derotateToAngle,
  pourUntilAngle,
  radToDeg,
  vecToDir,
  getAngleEntity,
  getStirDirection,
  straighten,
  vSub,
  getCoord,
  getTotalSun,
  setDisplay,
} from "../mainScript";
import { SaltType, Effects } from "../mainScript";

const recipes = {
  r1: {
    title: "Rage",
    desc: "Rage",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { Moonsalt: 95, SunSalt: 288 },
    script: () => r1(),
  },
};

function r1() {
  logSkirt();
  logAddStirCauldron(5.302);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(14);
  console.log("d1: " + getStirDirection());
  console.log(stirIntoVortex(5.7));
  console.log("d2~d1: " + (getAngleEntity() - Math.PI / 2));
  logAddSetPosition(-5, 5);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  logAddSunSalt(23);
  const p1 = getCoord();
  console.log(stirToTurn({ preStir: 4 }));
  const p2 = getCoord();
  const d3 = vecToDir(vSub(p2, p1));
  console.log("d3: " + d3);
  straighten(d3, SaltType.Sun, { maxGrains: 289 - getTotalSun() });
  stirIntoVortex(3);
  console.log(getAngleEntity() - Math.PI);
  derotateToAngle(80 * 0.36 + 12.26);
  logAddHeatVortex(Infinity);
  console.log(radToDeg(getStirDirection()));
  setDisplay();
  stirToDangerZoneExit(2);
  pourUntilAngle(80 * 0.36 + 11.99);
  logAddMoonSalt(27);
  logAddStirCauldron(2.482);
  logAddMoonSalt(1);
  console.log(stirToTarget(Effects.Water.Rage, { maxStir: 0.4 }));
  logAddMoonSalt(52);
}
