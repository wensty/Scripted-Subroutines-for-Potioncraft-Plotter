import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  pourToZoneV2,
  pourUntilAngle,
  saltToDeg,
  getAngleOrigin,
  getStirDirection,
  checkBase,
  straighten,
  getTotalSun,
} from "../mainScript";
import { Salt } from "../mainScript";

const recipes = {
  r1: {
    title: "Slipperiness",
    desc: "Slipperiness",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 548 },
    script: () => {
      checkBase("oil");
      logSkirt();
      logAddSunSalt(117);
      logAddStirCauldron(4.55);
      const a1 = getAngleOrigin(true);
      const a2 = getStirDirection();
      console.log(a1);
      console.log(a2);
      straighten(a1, Salt.Sun, { maxGrains: 336 });
      stirToTurn({ preStirLength: 9.5 });
      const a3 = getAngleOrigin();
      console.log(a3);
      straighten(a1, Salt.Sun, { maxGrains: 501 - getTotalSun() });
      const a4 = getStirDirection();
      console.log(a4);
      // console.log(saltToDeg("moon", 499 - (a1 - a4) / (Math.PI / 500)));
      pourUntilAngle(saltToDeg("moon", 499 - (a1 - a4) / (Math.PI / 500)));
      stirToTurn();
      pourToZoneV2({ exitZone: true, overPour: true });
      logAddPourSolvent(0.2); // pour some more distance.
      straighten(a1, Salt.Sun, { maxGrains: 47 });
      logAddStirCauldron(10.4);
      logAddHeatVortex(2.5);
    },
  },
};
