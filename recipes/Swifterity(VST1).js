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
  getTotalMoon,
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
    Salts: { MoonSalt: 222, SunSalt: 960 },
    Effects: VST1,
    script: () => r1(),
  },
};

function r1() {
  checkBase("wine");
  logAddSunSalt(501);
  logAddIngredient(Ingredients.GraveTruffle);
  derotateToAngle(-36.11);
  stirToDangerZoneExit(9.0);
  for (let i = 0; i < 15; i++) {
    logAddStirCauldron(0.1);
    pourToZone(0.2);
  }
  logAddStirCauldron(0.1);
  logAddPourSolvent(0.012);
  stirToTier(Effects.Wine.Swiftness, { preStir: 1.4, deviation: 99.77, ignoreAngle: true });
  logAddMoonSalt(Math.round((45 - currentPlot.pendingPoints[0].angle) / 0.36));
  logAddStirCauldron(1e-13, { shift: 0 });
  logAddMoonSalt(222 - getTotalMoon());
  logAddStirCauldron(5.379);
  logAddSunSalt(23);
  stirToTurn({ preStir: 4.2 });
  logAddStirCauldron(3.109);
  logAddSunSalt(436);
  logAddStirCauldron(Infinity);
  logAddPourSolvent(2.204);
}
