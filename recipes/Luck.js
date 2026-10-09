import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToTarget,
  degToRad,
  getAngleOrigin,
  checkBase,
  straighten,
} from "../mainScript";
import { Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const StrongLuck = { Luck: 3 };
const Luck = { Luck: 2 };
const WeakLuck = { Luck: 1 };

const recipes = {
  r1: {
    title: "Luck",
    desc: "Luck",
    version: "betaV3",
    base: "wine",
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 922 },
    Effects: StrongLuck,
    recipe: r1,
  },
};

function r1() {
  checkBase(BaseNames.Wine);
  const pre = 3;
  const target = 922;
  logAddSunSalt(pre);
  logSkirt();
  straighten(degToRad(94.5), SaltNames.Sun, { preStir: 4.0, maxGrains: 334, logAuxLine: false });

  stirToTurn({ preStir: 9.0 });
  const a1 = getAngleOrigin();

  straighten(a1, SaltNames.Sun, { maxGrains: 501 - getSun() });
  pourUntilAngle(-11.99 - (target - 501) * 0.36);

  straighten(degToRad(43.5), SaltNames.Sun, { preStir: 10.5, maxStir: 1.8, maxGrains: target - getSun() });

  // centering

  logAddStirCauldron(4.01);
  logAddSunSalt(1);
  stirToTarget(Effects.Wine.Luck, { preStir: 0 });
  logAddSunSalt(target - getSun());
  console.log(getDeviation(Effects.Wine.Luck));
}
