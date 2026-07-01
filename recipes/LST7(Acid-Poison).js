import {
  logAddIngredient,
  logSkirt,
  logAddSunSalt,
  // Wrapped operation instructions.
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToVortexEdge,
  stirToDangerZoneExit,
  stirToConsume,
  heatAndPourToEdge,
  derotateToAngle,
  // Conversions between angles, 2D vectors and directions.
  degToRad,
  // Extraction of other informations.
  checkBase,
  // Complex subroutines.
  straighten,
  // getters and setters.
  getMoon,
  getStir,
} from "../mainScript";
import { SaltNames, BaseNames } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const LST7 = {
  Acid: 3,
  Poison: 2,
};

const recipes = {
  r1: {
    title: "LST7",
    desc: "",
    version: "betaV3",
    base: BaseNames.Wine,
    Ingredients: { PhantomSkirt: 1, GraveTruffle: 1 },
    Salts: { MoonSalt: 105, SunSalt: 233 },
    Effects: LST7,
    script: r1,
  },
};

function r1() {
  checkBase(BaseNames.Water);
  const targetSun = 105;
  logAddSunSalt(targetSun);
  logAddIngredient(Ingredients.GraveTruffle);
  derotateToAngle((targetSun - 61.4) * 0.36);
  stirIntoVortex(6.5);
  logAddHeatVortex(Infinity);
  stirIntoVortex();
  console.log(getStir());
  derotateToAngle(0);
  heatAndPourToEdge(1, 6);
  logAddHeatVortex(3.58);
  stirToVortexEdge();
  for (let i = 0; i < 34; i++) {
    logAddHeatVortex(0.05);
    stirToVortexEdge();
  }
  console.log(getStir());
  straighten(degToRad(-122), SaltNames.Moon, { maxGrains: 151 });
  logSkirt();
  straighten(degToRad(-122), SaltNames.Moon, { maxGrains: 338 - targetSun - getMoon() });

  // part 2

  stirIntoVortex(10.8);
  stirToConsume(24, 1);
  derotateToAngle(0);
  heatAndPourToEdge(1, 7);
  logAddHeatVortex(5.6);
  logAddStirCauldron(13.3);
  logAddPourSolvent(21);
  stirToDangerZoneExit();
  logAddPourSolvent(7.14);
  logAddStirCauldron(2.19);
}
