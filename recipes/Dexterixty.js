import {
  logSkirt,
  logAddSunSalt,
  // Wrapped operation instructions.
  logAddHeatVortex,
  stirToTurn,
  stirToTarget,
  stirToConsume,
  // Pouring subroutines.
  pourToVortexEdge,
  heatAndPourToEdge,
  derotateToAngle,
  radToDeg,
  // Angle and direction extractions.
  getAngleOrigin,
  getStirDirection,
  // Complex subroutines.
  straighten,
  getSun,
  checkBase,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

const StrongDexterity = { Dexterity: 3 };
const Dexterity = { Dexterity: 2 };
const WeakDexterity = { Dexterity: 1 };

const recipes = {
  r1: {
    title: "Dexterixty",
    version: "betaV3",
    base: BaseNames.Water,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 253 },
    Effects: StrongDexterity,
    script: r1,
  },
};

function r1() {
  logSkirt();
  logAddSunSalt(22);
  // logAddStirCauldron(4.55);
  stirToTurn({ preStir: 4.53, directionBuffer: 0 });
  const d1 = getAngleOrigin();
  console.log("d: " + radToDeg(getAngleOrigin()));
  console.log("~<d: " + radToDeg(getStirDirection()));
  straighten(d1, SaltNames.Sun, { maxGrains: 253 - getSun() });
  stirToTurn({ preStir: 12 });
  logAddHeatVortex(2);
  derotateToAngle(0);
  pourToVortexEdge();
  heatAndPourToEdge(1, 7);
  logAddHeatVortex(5.45);
  stirToConsume(8, 1);
  stirToTarget(Effects.Water.Dexterity, { preStir: 7.4, maxStir: 0.6 });
}

function r2() {
  checkBase(BaseNames.Water);
  logAddSunSalt(7);
  logAddIngredient(Ingredients.Waterbloom, 0.92);
  logAddIngredient(Ingredients.Tangleweed, 0.922);
  logAddIngredient(Ingredients.Icefruit, 1);
  logAddStirCauldron(0.16);
  logAddPourSolvent(Infinity);
  stirToTurn({ preStir: 31.4 });
  stirToTurn();
  logAddHeatVortex(5);
  pourToVortexEdge();
  heatAndPourToEdge(1, 11);
  logAddHeatVortex(5.3);
}
