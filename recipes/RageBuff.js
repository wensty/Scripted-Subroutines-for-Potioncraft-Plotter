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
  stirToTier,
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  vecToDir,
  vecToDirCoord,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  straighten,
  vSub,
  getSun,
  getStir,
  getCoord,
} from "../mainScript";
import { DeviationT1, SaltNames, Effects } from "../mainScript";

const recipes = {
  r1: {
    title: "RageBuff",
    desc: "RageBuff",
    version: 3,
    base: "water",
    Ingredients: { PhantomSkirt: 2 },
    Salts: { SunSalt: 948 },
    Effects: { Dexterity: 1, Strength: 1, Healing: 1, Swiftness: 1, Rage: 1 },
    script: r1,
  },
};

function r1() {
  checkBase("water");
  logSkirt();
  logSkirt();
  logAddStirCauldron(5);
  logAddSunSalt(40);
  logAddSunSalt(263 - 40);
  stirIntoVortex();
  stirToTurn();
  logAddSunSalt(501 - getSun());
  heatAndPourToEdge(3, 5);
  derotateToAngle(-97.7);
  logAddHeatVortex(5.828);
  const d1 = radToDeg(getHeatDirection()) + 270;
  const c1 = getCoord();
  stirToTier(Effects.Water.Dexterity, { preStir: 2.0, deviation: DeviationT1, ignoreAngle: true });
  const c2 = getCoord();
  console.log("d1: " + d1);
  console.log("~d1: " + radToDeg(vecToDir(vSub(c2, c1))));
  console.log("~d1: " + radToDeg(vecToDirCoord(20.86 - c1.x, 3.19 - c1.y)));

  logAddPourSolvent(5.61);
  stirToDangerZoneExit();
  logAddPourSolvent(6.565);
  stirToDangerZoneExit();
  console.log("stir: " + getStir());
  logAddPourSolvent(6.22);
  stirIntoVortex(6.6);
  derotateToAngle(0);
  console.log("stir: " + getStir());
  logAddHeatVortex(Infinity);
  straighten(degToRad(-148), SaltNames.Sun, { preStir: 0.2, maxGrains: 116 });
  // stirToTier(Effects.Water.Strength,{preStir:3.1,deviation:DeviationT1,ignoreAngle:true})
  // console.log(radToDeg(getAngleEffect())-180)
  stirIntoVortex(4);
  derotateToAngle(0);
  logAddHeatVortex(5);
  pourToVortexEdge();
  heatAndPourToEdge(3, 5);
  logAddPourSolvent(2.6);
  stirIntoVortex();
  logAddPourSolvent(Infinity);

  logAddStirCauldron(3.3);
  const d2 = radToDeg(getStirDirection()) + 90;
  logAddPourSolvent(Infinity);
  stirIntoVortex(6);
  console.log("d2: " + d2);
  console.log("~d2: " + radToDeg(getAngleEntity()));
  logAddHeatVortex(5);
  logAddPourSolvent(1.2);
  logAddHeatVortex(Infinity);

  logAddSunSalt(86);
  stirToZone({ preStir: 2.4 });
  logAddSunSalt(98);
  const c3 = getCoord();
  stirToTurn();
  const c4 = getCoord();
  console.log("direction: " + radToDeg(vecToDir(vSub(c4, c3))));
  straighten(vecToDir(vSub(c4, c3)), SaltNames.Sun, { maxGrains: 97 });
  stirIntoVortex(8.4);
  derotateToAngle(3.75, { toAngle: false });
  logAddHeatVortex(Infinity);
  const c5 = getCoord();
  const d3 = vecToDirCoord(-20.34 - c5.x, 22.58 - c5.y);
  console.log("d3: " + d3);
  straighten(d3, SaltNames.Sun, { maxGrains: 50 });
  logAddStirCauldron(Infinity);
  const c6 = getCoord();
  console.log("~d3: " + vecToDir(vSub(c6, c5)));
}
