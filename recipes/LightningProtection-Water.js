import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddPourSolvent,
  stirIntoVortex,
  stirToDangerZoneExit,
  stirToNearestTarget,
  derotateToAngle,
  degToRad,
  getBottlePolarAngleByEntity,
  checkBase,
  straighten,
  getTotalSun,
} from "../main";
import { Salt, Effects } from "../main";

function beta_916s_80lt() {
  checkBase("water");
  logSkirt(0.258);
  logSkirt();
  logAddSunSalt(310);
  straighten(degToRad(180), Salt.Sun, { preStirLength: 4.8, maxGrains: 125 });
  stirIntoVortex(2.6);
  console.log("~0:" + getBottlePolarAngleByEntity());
  logAddHeatVortex(Infinity);
  stirIntoVortex(3.2);
  logAddHeatVortex(Infinity);
  straighten(degToRad(150), Salt.Sun, { preStirLength: 9.6, maxGrains: 39 });
  stirIntoVortex(4.6);
  logAddSunSalt(501 - getTotalSun());
  derotateToAngle(189 * 0.36, { toAngle: false });
  logAddHeatVortex(Infinity);
  straighten(degToRad(-141.5), Salt.Sun, { preStirLength: 5.522, ignoreReverse: false });
  stirToDangerZoneExit();
  logAddPourSolvent(0.82); // empirical
  logAddSunSalt(35);
  console.log(
    "centering:" +
      stirToNearestTarget(Effects.Water.LightningProtection, {
        preStirLength: 9.2,
        maxStirLength: 0.5,
      })
  );
}
