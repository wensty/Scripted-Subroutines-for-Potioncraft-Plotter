import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToZone,
  stirToDangerZoneExit,
  stirToTarget,
  pourToZone,
  derotateToAngle,
  // Conversions between angles, 2D vectors and directions.
  degToRad,
  vecToDir,
  relDir,
  // Angle and direction extractions.
  getAngleOrigin,
  // Extraction of other informations.
  checkBase,
  getCoord,
  // Complex subroutines.
  straighten,
  vSub,
  getSun,
  setVirtual,
  unsetVirtual,
} from "../mainScript";
import { SaltAngle, Entity, SaltNames, BaseNames, Effects } from "../mainScript";

const StrongFear = { Fear: 3 };
// const Fear = { Fear: 2 };
// const WeakFear = { Fear: 1 };

const recipes = {
  r1: {
    title: "Fear",
    desc: "Fear",
    version: "betaV3",
    base: BaseNames.Wine,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 1222 },
    effect: StrongFear,
    script: r1,
  },
};

function r1() {
  checkBase(BaseNames.Wine);
  logAddSunSalt(335);
  logSkirt();
  derotateToAngle(0);
  straighten(degToRad(-65), SaltNames.Sun, { maxGrains: 200 });
  logAddStirCauldron(7.66);
  logAddSunSalt(39);
  logAddStirCauldron(0.9);
  logAddSunSalt(40);
  stirToTurn();
  straighten(getAngleOrigin(), SaltNames.Sun, { maxGrains: 222 });
  pourToZone();
  logAddSunSalt(26);
  stirToTurn();
  pourToZone();
  logAddSunSalt(3);
  for (let i = 0; i < 37; i++) {
    logAddStirCauldron(i == 3 ? 0.05 : 0.05);
    pourToZone();
  }
  logAddSunSalt(5);
  stirToZone({ zone: Entity.StrongDangerZone, preStir: 3.5, exitZone: true, overStir: true });
  logAddSunSalt(3);
  logAddStirCauldron(1.1);
  logAddSunSalt(16);
  logAddStirCauldron(0.9);
  logAddSunSalt(53);
  logAddStirCauldron(0.87);
  logAddSunSalt(28);
  stirToZone({ zone: Entity.StrongDangerZone, exitZone: true, overStir: true });
  logAddSunSalt(0);
  stirToDangerZoneExit();

  for (let i = 0; i < 34; i++) {
    const bottlePolarAngle = getAngleOrigin();
    const c1 = getCoord();
    setVirtual();
    logAddStirCauldron(0.05);
    const c2 = getCoord();
    unsetVirtual();
    const currentDirection = vecToDir(vSub(c2, c1));
    const relativeDirection = relDir(currentDirection, bottlePolarAngle);
    console.log(relativeDirection);
    if (relativeDirection < -SaltAngle / 2) {
      logAddSunSalt(Math.round(-relativeDirection / SaltAngle));
    }
    logAddStirCauldron(0.05);
    pourToZone(0.4);
  }
  logAddSunSalt(1222 - getSun());
  for (let i = 0; i < 60; i++) {
    logAddStirCauldron(0.05);
    pourToZone(0.15);
  }
  // centering
  logAddStirCauldron(0.431);
  logAddPourSolvent(0.236);
  stirToTarget(Effects.Wine.Fear, { preStir: 1.0, maxStir: 1.2 });
}
