import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToTarget,
  pourUntilAngle,
  degToRad,
  radToDeg,
  vecToDir,
  getAngleOrigin,
  getStirDirection,
  checkBase,
  getDeviation,
  getCoord,
  getAngle,
  straighten,
  vSub,
  getSun,
  setVirtual,
  unsetVirtual,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

function r1() {
  checkBase(BaseNames.Oil);
  logSkirt();
  logAddSunSalt(328);
  stirToTurn({ preStir: 4.53, directionBuffer: 0 });
  const a1 = getAngleOrigin();
  const a2 = getStirDirection();
  console.log("a1:" + a1);
  console.log("a2~<a1:" + a2);
  straighten(a1, SaltNames.Sun, { maxGrains: 501 - getSun() });
  const target = 929;
  // pourUntilAngle(getAngle()+((1000-target)*0.36-12))
  console.log(getStirDirection());
  while (true) {
    setVirtual();
    const a = getStirDirection();
    const d1 = pourUntilAngle(getAngle() + radToDeg(a1 - a)).distance;
    setVirtual();
    const d2 = pourUntilAngle(-(target - 501) * 0.36 - 11.99).distance;
    unsetVirtual();
    logAddPourSolvent(d1 < d2 ? d1 : d2);
    if (d1 >= d2) {
      break;
    }
    stirToTurn({ directionBuffer: 0 });
  }

  const d = -148.6;
  straighten(degToRad(d), SaltNames.Sun, { maxGrains: 119 });

  const p1 = getCoord();
  stirToTurn({ preStir: 8.8 });
  const p2 = getCoord();
  const d1 = vecToDir(vSub(p2, p1));
  console.log("d1~d:" + radToDeg(d1));
  straighten(degToRad(d), SaltNames.Sun, { maxGrains: 243 });

  straighten(degToRad(155), SaltNames.Sun, { maxGrains: target - getSun() - 1, preStir: 9.0 });
  logAddStirCauldron(2.1);
  logAddSunSalt(1);
  stirToTarget(Effects.Oil.Gluing, { preStir: 0.0, maxStir: 4.0 });
  console.log(getDeviation(Effects.Oil.Gluing));
}
