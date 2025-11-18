import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToTurn,
  derotateToAngle,
  pourUntilAngle,
  radToDeg,
  vecToDir,
  getAngleOrigin,
  getAngleEntity,
  getStirDirection,
  straighten,
  vSub,
  getSun,
  getCurrentPoint,
  getCoord,
  setDisplay,
} from "../mainScript";
import { SaltNames, BaseNames } from "../mainScript";

const StrongPoisonProtection = { PoisonProtection: 3 };
const PoisonProtection = { PoisonProtection: 2 };
const WeakPoisonProtection = { PoisonProtection: 1 };

const recipes = {
  r1: {
    title: "Poison Protection",
    desc: "Poison Protection",
    version: 3,
    base: BaseNames.Oil,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 747 },
    Effects: StrongPoisonProtection,
    script: () => r1(),
  },
};

function r1() {
  logSkirt();
  logAddSunSalt(154);
  logAddStirCauldron(4.6);
  const d1 = getAngleOrigin();
  straighten(d1, SaltNames.Sun, { maxGrains: 501 - getSun() });
  console.log(d1);
  setDisplay();
  for (let i = 0; i < 2; i++) {
    pourUntilAngle(-getCurrentPoint().angle + radToDeg(d1 - getStirDirection()));
    stirToTurn({ directionBuffer: 0 });
  }
  logAddPourSolvent(0.028);
  logAddStirCauldron(5.432);
  logAddSunSalt(36);
  logAddStirCauldron(1.127);
  logAddSunSalt(30);
  const c1 = getCoord();
  console.log(stirToTurn({ preStir: 2.5 }));
  const c2 = getCoord();
  straighten(vecToDir(vSub(c2, c1)), SaltNames.Sun, { maxGrains: 747 - getSun() });
  console.log(stirIntoVortex(10.9));
  console.log(vecToDir(vSub(c1, c2)));
  console.log(getAngleEntity());
  derotateToAngle(0);
  logAddStirCauldron(4.47);
  logAddPourSolvent(1.012);
}
