import {
  logAddIngredient,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  // Wrapped operation instructions.
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTier,
  // Pouring subroutines.
  pourToVortexEdge,
  heatAndPourToEdge,
  pourIntoVortex,
  derotateToAngle,
  // Conversions between angles, 2D vectors and directions.
  degToRad,
  radToDeg,
  vecToDir,
  vecToDirCoord,
  getAngleEntity,
  getHeatDirection,
  getDerotateRate,
  // Extraction of other informations.
  checkBase,
  // Complex subroutines.
  straighten,
  vSub,
  getSun,
  getStir,
  getCoord,
} from "../mainScript";
import { DeviationT1, SaltNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const PST2 = {
  Strength: 1,
  StoneSkin: 1,
  Swiftness: 1,
  Dexterity: 1,
  MagicalVision: 1,
};

const recipes = {
  r1: {
    title: "PST2",
    desc: "",
    version: "betaV3",
    base: "water",
    Ingredients: { PhantomSkirt: 1, GraveTruffle: 1 },
    Salts: { MoonSalt: 36, SunSalt: 683 },
    Effects: PST2,
    script: r1,
  },
};

function r1() {
  checkBase("water");
  logSkirt();
  logAddStirCauldron(5.3);
  logAddSunSalt(270);
  stirToTurn({ preStir: 11.2 });
  logAddSunSalt(501 - getSun());
  heatAndPourToEdge(3, 6);
  derotateToAngle(18, { toAngle: false });
  logAddHeatVortex(3.548);
  const c1 = getCoord();
  console.log("d1: " + (getHeatDirection() - Math.PI / 2));
  stirToTier(Effects.Water.MagicalVision, {
    preStir: 2,
    deviation: DeviationT1,
    ignoreAngle: true,
  });
  const c2 = getCoord();
  console.log("~d1: " + vecToDir(vSub(c2, c1)));
  pourIntoVortex(16, 6);
  logAddHeatVortex(8);
  console.log("stir:" + getStir());
  pourToVortexEdge();
  heatAndPourToEdge(3, 6);
  derotateToAngle(38.7, { toAngle: false });
  logAddHeatVortex(5.756);
  const c3 = getCoord();
  console.log("d2: " + (getHeatDirection() + Math.PI * 1.5));
  stirToTier(Effects.Water.Dexterity, { preStir: 2.0, deviation: DeviationT1, ignoreAngle: true });
  const c4 = getCoord();
  console.log("~d2: " + vecToDir(vSub(c4, c3)));
  console.log("~d2: " + vecToDirCoord(20.86 - c3.x, 3.19 - c3.y));
  logAddPourSolvent(5.468);
  stirToDangerZoneExit();
  logAddPourSolvent(6.42);
  stirToDangerZoneExit();
  console.log(getDerotateRate());
  console.log(getStir());
  logAddPourSolvent(Infinity);
  const pre = 103;
  const dir = 172;
  const s1 = 128;
  straighten(degToRad(dir), SaltNames.Sun, { preStir: 4.2, maxGrains: pre });
  logAddIngredient(Ingredients.GraveTruffle);
  straighten(degToRad(dir), SaltNames.Sun, { maxGrains: s1 - pre });
  stirIntoVortex(2.5);
  derotateToAngle(17.5, { toAngle: false });
  console.log("~dir: " + (radToDeg(getAngleEntity()) + 180));
  logAddHeatVortex(Infinity);
  stirIntoVortex(4.5);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(1.948);
  logAddSunSalt(54);
  stirToDangerZoneExit();
  logAddPourSolvent(0.536);
  stirToDangerZoneExit();
  logAddPourSolvent(0.788);
  stirToDangerZoneExit();
  logAddPourSolvent(0.724);
  stirToDangerZoneExit();
  logAddPourSolvent(0.804);
  stirToDangerZoneExit();
  logAddPourSolvent(1.276);
  stirToDangerZoneExit();
  logAddPourSolvent(0.35);
  stirToTurn();
  logAddPourSolvent(4);
  logAddHeatVortex(Infinity);
  logAddPourSolvent(Infinity);
  stirToTurn({ preStir: 1.7 });
  logAddMoonSalt(36);
  stirIntoVortex(4.1);
  logAddHeatVortex(4.2);
  logAddPourSolvent(1.2);
  logAddHeatVortex(3);
  derotateToAngle(0);
  logAddHeatVortex(Infinity);
  stirToTurn({ preStir: 6.6 });
}
