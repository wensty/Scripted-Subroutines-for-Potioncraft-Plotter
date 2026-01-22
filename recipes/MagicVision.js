import {
  logAddIngredients,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToVortexEdge,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  getAngleOrigin,
  getStirDirection,
  checkBase,
  getAngle,
  straighten,
} from "../mainScript";
import { Entity, SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const recipes = {
  r1: {
    title: "MagicVision-Wine",
    desc: "493s+193m",
    version: 3,
    base: BaseNames.Wine,
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 193, SunSalt: 493 },
    script: () => r1,
  },
  r2: {
    title: "MagicVision-Wine",
    desc: "Cheap",
    version: "BetaV3",
    base: BaseNames.Wine,
    tier: 3,
    Ingredients: { Lifeleaf: 4 },
    Salts: { SunSalt: 281 },
    script: () => r2,
  },
};

function r1() {
  checkBase(BaseNames.Wine);
  logSkirt(0.84);
  logAddStirCauldron(4.7);
  straighten(degToRad(85), SaltNames.Sun, { maxGrains: 328 });
  stirToZone({ zone: Entity.DangerZone, preStir: 3, overStir: false });
  logAddSunSalt(20);
  straighten(degToRad(40), SaltNames.Sun, { preStir: 5, maxGrains: 145 });
  logAddStirCauldron(6.833);
  logAddPourSolvent(0.7);
  logAddMoonSalt(53);
  logAddStirCauldron(3.925);
  logAddMoonSalt(1);
  stirToTarget(Effects.Wine.MagicalVision, { maxStir: 0.5 });
  logAddMoonSalt(139);
}
function r2() {
  checkBase(BaseNames.Water);
  const target = 281;
  logAddSunSalt(target);
  logAddIngredients(Ingredients.Lifeleaf, [1, 0.866]);
  console.log(getAngle());
  // const der = 10.67
  // derotateToAngle(der, { toAngle: false });
  derotateToAngle(90.49);
  logAddIngredients(Ingredients.Lifeleaf, [1, 1]);
  // const total = 77.23;
  // derotateToAngle(total-der, { toAngle: false });
  derotateToAngle(23.93);
  stirIntoVortex(20);
  derotateToAngle(0);
  heatAndPourToEdge(1, 5);
  for (let i = 0; i < 22; i++) {
    logAddHeatVortex(0.204);
    stirToVortexEdge();
  }
  logAddHeatVortex(0.196);
  stirToVortexEdge();
  stirToTurn({ preStir: 4.65, directionBuffer: 0.0 });
  console.log("dir:" + radToDeg(getStirDirection()));
  console.log(">dir" + radToDeg(getAngleOrigin()));
  logAddPourSolvent(0.3);
  stirToDangerZoneExit(1);
  logAddPourSolvent(0.24);
  logAddStirCauldron(Infinity);
}
