import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToZone,
  pourToZoneV2,
  degToRad,
  checkBase,
  straighten,
  getTotalSun,
  setPreStir,
} from "../mainScript";
import { Salt } from "../mainScript";

const recipes = {
  r1: {
    title: "Levitation",
    desc: "Levitation",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 515 },
    script: () => s1(),
  },
};

function s1() {
  checkBase("wine");
  logSkirt();
  const d1 = 1.6;
  logAddStirCauldron(d1);
  logAddPourSolvent(Infinity);
  logAddSunSalt(20);
  setPreStir(3.1);
  straighten(degToRad(36), Salt.Sun, { maxGrains: 142 });
  setPreStir(9.0);
  straighten(degToRad(0), Salt.Sun, { maxGrains: 187 });
  setPreStir(8.0);
  straighten(degToRad(-68.1), Salt.Sun, { maxGrains: 501 - getTotalSun() });
  logAddPourSolvent(0.076);
  logAddSunSalt(14);
  stirToZone({ exitZone: true });
  for (let i = 0; i < 52; i++) {
    logAddStirCauldron(0.005);
    pourToZoneV2();
  }
}
