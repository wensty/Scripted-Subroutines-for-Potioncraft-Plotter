import {
  logAddIngredient,
  logAddIngredients,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToZone,
  stirToTarget,
  // Conversions between angles, 2D vectors and directions.
  degToRad,
  radToDeg,
  vecToDir,
  // Angle and direction extractions.
  getAngleOrigin,
  getStirDirection,
  // Extraction of other informations.
  checkBase,
  getDeviation,
  getPoint,
  getCoord,
  // Complex subroutines.
  straighten,
  vSub,
  // getters and setters.
  getMoon,
  getSun,
  getStir,
  setVirtual,
  unsetVirtual,
} from "../mainScript";
import { Entity, BaseNames, SaltNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

const StrongNecromancy = { Necromancy: 3 };
const Necromancy = { Necromancy: 2 };
const WeakNecromancy = { Necromancy: 1 };

const recipes = {
  r1: {
    title: "Necromancy",
    desc: "467m-46s",
    version: 3,
    base: BaseNames.Wine,
    Ingredients: { GraveTruffle: 1 },
    Salts: { MoonSalt: 467, SunSalt: 46, LifeSalt: 19 },
    Effects: StrongNecromancy,
    script: r1(),
  },
  r2: {
    title: "Necromancy",
    desc: "",
    version: "betaV3",
    base: BaseNames.Wine,
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 664 },
    Effects: StrongNecromancy,
    script: r2(),
  },
  r3: {
    title: "Necromancy",
    desc: "leaf version",
    version: "betaV3",
    base: BaseNames.Wine,
    tier: 3,
    Ingredients: { Lifeleaf: 4 },
    Salts: { MoonSalt: 124, SunSalt: 605 },
    Effects: StrongNecromancy,
    script: r3(),
  },
};

function r1() {
  checkBase("wine");
  logAddSunSalt(46);
  logAddIngredient(Ingredients.GraveTruffle);
  logAddPourSolvent(Infinity);
  stirToTurn(4.2);
  straighten(degToRad(-125), "moon", { maxStir: 8 });
  stirToTurn(0);
  logAddMoonSalt(130);
  logAddStirCauldron(0.4);
  logAddMoonSalt(1);
  logAddStirCauldron(0.452);
  logAddMoonSalt(467 - getMoon());
  stirToTarget(Effects.Wine.Necromancy, { preStir: 9 });
}

function r2() {
  checkBase("wine");
  logAddSunSalt(197);
  logSkirt();
  logAddStirCauldron(3);
  logAddPourSolvent(Infinity);
  logAddStirCauldron(2.7);
  logAddPourSolvent(Infinity);
  console.log(radToDeg(getStirDirection()));
  stirToZone({ preStir: 8.4 });
  for (let i = 0; i < 26; i++) {
    logAddPourSolvent(0.05);
    stirToZone();
  }
  console.log("Total stir: " + getStir());
  logAddPourSolvent(0.01);
  stirToZone();
  straighten(degToRad(-142.4), SaltNames.Sun, { maxGrains: 185 });
  straighten(degToRad(-157.6), SaltNames.Sun, { preStir: 8.5, maxGrains: 224 });

  setVirtual();
  stirToZone({ exitZone: true, overStir: false });
  console.log(getPoint().health);
  unsetVirtual();

  logAddStirCauldron(3.953);
  logAddSunSalt(1);
  stirToTarget(Effects.Wine.Necromancy);
  logAddSunSalt(664 - getSun());
}

function r3() {
  logAddIngredients(Ingredients.Lifeleaf, [1.0, 1.0]);
  logAddSunSalt(103);
  // logAddStirCauldron(4.95)
  stirToTurn({ preStir: 4.93, directionBuffer: 0 });
  // console.log(getStirDirection())
  // console.log(getAngleOrigin())
  const d1 = getAngleOrigin();
  // 75 grains
  straighten(d1, SaltNames.Sun, { maxStir: 0.7 });
  const t = 46;
  logAddSunSalt(t);
  logAddIngredients(Ingredients.Lifeleaf, [1.0, 1.0]);
  logAddSunSalt(55 - t);

  const c1 = getCoord();
  // logAddStirCauldron(6.87)
  stirToTurn({ preStir: 6.87, directionBuffer: 0 });
  const c2 = getCoord();
  // console.log(getStirDirection())
  // console.log(vecToDir(vSub(c2,c1)))
  const d2 = vecToDir(vSub(c2, c1));
  straighten(d2, SaltNames.Sun, { maxStir: 1.85 });
  stirToTurn();
  // logAddMoonSalt(121)

  const angle = -155;
  straighten(degToRad(angle), SaltNames.Sun, { maxGrains: 1, preStir: 4.7 });
  straighten(degToRad(angle), SaltNames.Sun, { ignoreReverse: false });
  straighten(degToRad(angle), SaltNames.Moon, { maxGrains: 124 });
  console.log(stirToZone({ zone: Entity.DangerZone, exitZone: true, overStir: false }));
  console.log(-currentPlot.pendingPoints[0].health * 250);

  logAddStirCauldron(4.13);
  logAddPourSolvent(0.41);
  stirToTarget(Effects.Wine.Necromancy, { preStir: 1 });
  console.log(getDeviation(Effects.Wine.Necromancy));
}
