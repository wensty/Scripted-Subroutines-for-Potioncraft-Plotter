import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  stirToTarget,
  stirToConsume,
  heatAndPourToEdge,
  pourToZoneV2,
  derotateToAngle,
  pourUntilAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  vecToDirCoord,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  getHeatDirection,
  checkBase,
  straighten,
  getSun,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

const StrongAcidProtection = { AcidProtection: 3 };
const AcidProtection = { AcidProtection: 2 };
const WeakAcidProtection = { AcidProtection: 1 };

const recipes = {
  r1: {
    title: "Acid Protection",
    desc: "Acid Protection",
    version: "betaV3",
    base: BaseNames.Oil,
    Ingredients: { PhantomSkirt: 2 },
    Salts: { SunSalt: 682 },
    Effects: StrongAcidProtection,
    script: r1,
  },
};

function r1() {
  // part 1: 548 sun to Slipperiness vortex.
  checkBase(BaseNames.Oil);
  logSkirt();
  const s1 = 62;
  logAddSunSalt(s1);
  logSkirt();
  logAddSunSalt(117 - getSun());
  logAddStirCauldron(4.55);
  const a1 = getAngleOrigin();
  const a2 = getStirDirection();
  console.log("a1: " + a1);
  console.log("~a1: " + a2);
  straighten(a1, SaltNames.Sun, { maxGrains: 336 });
  stirToTurn({ preStir: 9.5 });
  const a3 = getAngleOrigin();
  console.log("a3: " + a3);
  straighten(a1, SaltNames.Sun, { maxGrains: 501 - getSun() });
  const a4 = getStirDirection();
  console.log("~a3: " + a4);
  pourUntilAngle(saltToDeg(SaltNames.Moon, 499 - (a1 - a4) / (Math.PI / 500)));
  stirToTurn();
  pourToZoneV2({ exitZone: true, overPour: true });
  logAddPourSolvent(0.2); // pour some more distance.
  straighten(a1, SaltNames.Sun, { maxGrains: 47 });
  logAddStirCauldron(10.4);
  logAddHeatVortex(6);
  // part 2
  stirToConsume(10.6, 1);
  derotateToAngle(19.57, { toAngle: false });
  logAddHeatVortex(Infinity);
  // least salt to enter vortex is 74. One more to save some path.
  straighten(degToRad(-176), SaltNames.Sun, { preStir: 9.8, maxGrains: 75 });
  stirIntoVortex();
  console.log(radToDeg(getAngleEntity()) - 180);
  heatAndPourToEdge(1, 6);
  logAddHeatVortex(2.588);
  const d1 = getHeatDirection() + Math.PI * 1.5;
  const d2 = vecToDirCoord(23.57 - 12.1, -30.32 + 23.43);
  console.log("d1: " + d1);
  console.log("~d1: " + d2);
  const s2 = 681 - getSun();
  derotateToAngle(-11.99 - s2 * 0.36); // perfect center is possible.
  straighten(d2, SaltNames.Sun, { preStir: 10.2, maxGrains: s2 - 1 });
  logAddStirCauldron(1.713);
  logAddSunSalt(1);
  console.log(stirToTarget(Effects.Oil.AcidProtection, { preStir: 3.4, maxStir: 0.5 }));
}
