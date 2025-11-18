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
  getSun,
  setPreStir,
  Effects,
} from "../mainScript";
import { SaltNames } from "../mainScript";

const StrongLevitation = { Levitation: 3 };
const Levitation = { Levitation: 2 };
const WeakLevitation = { Levitation: 1 };

const recipes = {
  r1: {
    title: "Levitation",
    desc: "Levitation",
    version: 3,
    base: "wine",
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 515 },
    Effects: StrongLevitation,
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
  straighten(degToRad(36), SaltNames.Sun, { preStir: 3.1, maxGrains: 142 });
  straighten(degToRad(0), SaltNames.Sun, { preStir: 9.0, maxGrains: 187 });
  straighten(degToRad(-68.1), SaltNames.Sun, { preStir: 8.0, maxGrains: 501 - getSun() });
  logAddPourSolvent(0.076);
  logAddSunSalt(14);
  stirToZone({ exitZone: true, overStir: true });
  pourToZoneV2();
  for (let i = 0; i < 52; i++) {
    logAddStirCauldron(0.005);
    pourToZoneV2();
  }
}
