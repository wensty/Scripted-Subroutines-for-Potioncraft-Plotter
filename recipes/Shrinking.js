import {
  logAddIngredient,
  logSkirt,
  logAddSunSalt,
  // Wrapped operation instructions.
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTarget,
  derotateToAngle,
  pourUntilAngle,
  // Conversions between angles, 2D vectors and directions.
  degToRad,
  radToDeg,
  saltToDeg,
  vecToDir,
  getAngleEntity,
  getStirDirection,
  // Extraction of other informations.
  checkBase,
  // Complex subroutines.
  straighten,
  vSub,
  getSun,
  getPoint,
  getCoord,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongShrinking = { Shrinking: 3 };
const Shrinking = { Shrinking: 2 };
const WeakShrinking = { Shrinking: 1 };

const recipes = {
  r1: {
    title: "Shrinking",
    desc: "Shrinking",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 967 },
    Effects: StrongShrinking,
    script: () => r1(),
  },
};

function r1() {
  checkBase(BaseNames.Oil);
  const pre1 = 29;
  logAddSunSalt(pre1);
  logAddIngredient(Ingredients.Watercap, 0.823);
  derotateToAngle(0);
  logAddStirCauldron(2.0);
  logAddPourSolvent(Infinity);
  console.log("d1: " + radToDeg(getStirDirection()));
  console.log(stirIntoVortex(4.0));
  console.log("d2~d1: " + (radToDeg(getAngleEntity()) + 90));
  logSkirt();
  logAddHeatVortex(Infinity);
  stirToDangerZoneExit(9.7);
  logAddSunSalt(40);
  const c1 = getCoord();
  logAddStirCauldron(3.62);
  const c2 = getCoord();
  const d3 = vecToDir(vSub(c2, c1));
  console.log("d3: " + d3);
  console.log("d4~d3: " + getStirDirection());
  straighten(d3, SaltNames.Sun, { maxGrains: 340 });
  stirToTurn({ preStir: 9.0 });
  const c3 = getCoord();
  console.log("d5~d3: " + vecToDir(vSub(c3, c1)));
  const s = Math.ceil((180.01 + getPoint().angle) / 0.36);
  straighten(d3, SaltNames.Sun, { maxGrains: s });
  const total = 967;
  console.log(pourUntilAngle(saltToDeg(SaltNames.Moon, total - getSun()) - 11.99));
  stirToTurn({ preStir: 0.5 });
  straighten(degToRad(110.8), SaltNames.Sun, { maxGrains: 190 });
  const c4 = getCoord();
  logAddSunSalt(25);
  logAddStirCauldron(8.13);
  const c5 = getCoord();
  console.log("d6: " + radToDeg(vecToDir(vSub(c5, c4))));
  logAddSunSalt(82);
  const c6 = getCoord();
  logAddStirCauldron(1.4);
  const c7 = getCoord();
  const d6 = vecToDir(vSub(c7, c6));
  console.log("d8: " + d6);
  console.log("d9~d8: " + getStirDirection());
  straighten(d6, SaltNames.Sun, { maxGrains: total - getSun() - 4 });
  logAddStirCauldron(1.082);
  logAddSunSalt(1);
  console.log(stirToTarget(Effects.Oil.Shrinking));
  logAddSunSalt(3);
}
