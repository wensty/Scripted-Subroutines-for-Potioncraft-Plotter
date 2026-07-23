import {
  logAddIngredient,
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  stirIntoVortex,
  stirToVortexEdge,
  stirToTurn,
  stirToTarget,
  stirToTier,
  derotateToAngle,
  pourUntilAngle,
  degToRad,
  vecToDirCoord,
  checkBase,
  getCoord,
  straighten,
  getMoon,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const LST2 = {
  AntiMagic: 3,
  StoneSkin: 2,
};

const recipes = {
  r1: {
    title: "LST2",
    desc: "LST2-ing version",
    version: "V3Beta",
    base: BaseNames.Oil,
    Ingredients: { GraveTruffle: 1, PhantomSkirt: 1 },
    Salts: { MoonSalt: 774, SunSalt: 203 },
    effect: LST2,
    script: r1,
  },
};

/**
 * 405.2 moon angle: add skirt.
 */
function r1() {
  checkBase(BaseNames.Oil);
  logAddMoonSalt(0);
  logAddIngredient(Ingredients.GraveTruffle);
  straighten(degToRad(152.2), SaltNames.Moon, { maxStir: 11 });
  stirToTurn({ preStir: 2 });
  straighten(degToRad(-113.2), SaltNames.Moon, { maxStir: 2 });
  // stirToTarget(Effects.Oil.StoneSkin,{preStir:2.3,maxStir:1.0})
  // console.log(getDeviation(Effects.Oil.StoneSkin))
  stirToTier(Effects.Oil.StoneSkin, { preStir: 2.3 });
  const s1 = getMoon();

  // part 2

  const target = 333;
  const rem = 405.1 - target;
  pourUntilAngle(-0.36 * rem, { minPour: 11 });
  stirToTurn({ preStir: 2.0 });
  const c1 = getCoord();
  const d1 = vecToDirCoord(3.88 - c1.x, 4.15 - c1.y);
  straighten(d1, SaltNames.Moon, { maxStir: 0.4 });
  const s2 = getMoon() - s1; // straighten salt
  stirIntoVortex(0.5);
  logAddHeatVortex(Infinity);
  stirToTurn();
  const a1 = 74.0;
  straighten(degToRad(a1), SaltNames.Moon, { maxGrains: target - s2, maxStir: 1 });
  logSkirt();
  const t2 = 39;
  const s3 = getMoon();
  straighten(degToRad(a1), SaltNames.Moon, { maxStir: 1 });
  const s4 = getMoon() - s3;
  stirToTurn({ preStir: 6.1 });
  logAddMoonSalt(t2 - s4);
  straighten(degToRad(56), SaltNames.Sun, { preStir: 4.0, maxGrains: 170 });

  // part 3

  stirIntoVortex(10.9);
  logAddHeatVortex(3);
  derotateToAngle(0);
  logAddHeatVortex(5);
  logAddSunSalt(32);
  stirToVortexEdge(0.6);
  logAddHeatVortex(1.3);
  stirToVortexEdge(1.9);
  for (let i = 0; i < 8; i++) {
    logAddHeatVortex(0.2);
    stirToVortexEdge();
  }
  logAddStirCauldron(0.385);
  logAddSunSalt(1);
  stirToTarget(Effects.Oil.AntiMagic, { preStir: 7.0, maxStir: 0.5 });
}
