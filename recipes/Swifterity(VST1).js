import {
  logAddIngredient,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToDangerZoneExit,
  stirToTier,
  pourToZone,
  derotateToAngle,
  checkBase,
  getMoon,
  getDeviation,
} from "../mainScript";
import { Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";
import { currentPlot } from "@potionous/plot";

const VST1 = {
  Swiftness: 3,
  Dexterity: 2,
};

const recipes = {
  r1: {
    title: "Void Salt",
    version: 3,
    base: "wine",
    Ingredients: { GraveTruffle: 1 },
    Salts: { MoonSalt: 219, SunSalt: 962 },
    Effects: VST1,
    script: () => r1(),
  },
};

function r1() {
  // Your Script here...
  checkBase("wine");
  const delay = 9;
  logAddSunSalt(501);
  derotateToAngle(-180 + delay);
  logAddIngredient(Ingredients.GraveTruffle);
  derotateToAngle(-36.12 + delay - 0.36);
  stirToDangerZoneExit(9.0);
  for (let i = 0; i < 15; i++) {
    logAddStirCauldron(0.1);
    pourToZone(0.2);
  }
  logAddStirCauldron(0.1);
  logAddPourSolvent(0.052);
  const s = (-currentPlot.pendingPoints[0].angle + 45) / 0.36;
  const sr = Math.round(s);
  const sd = Math.abs(s - sr) * 3.0;
  stirToTier(Effects.Wine.Swiftness, { preStir: 1.4, deviation: 100.0 - sd, ignoreAngle: true });
  logAddMoonSalt(Math.round((45 - currentPlot.pendingPoints[0].angle) / 0.36));
  logAddStirCauldron(1e-13, { shift: 0 });
  logAddMoonSalt(219 - getMoon());
  logAddStirCauldron(5.419);
  logAddSunSalt(21);
  stirToTurn({ preStir: 4.2 });
  logAddStirCauldron(3.168);
  logAddSunSalt(440);
  logAddStirCauldron(Infinity);
  logAddPourSolvent(2.276);
  console.log(getDeviation(Effects.Wine.Dexterity));
}
