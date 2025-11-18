import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToZone,
  stirToTarget,
  pourUntilAngle,
  degToRad,
  checkBase,
  straighten,
  getSun,
} from "../mainScript";
import { Entity, SaltNames, Effects } from "../mainScript";

const recipes = {
  r1: {
    title: "Libido",
    desc: "Libido",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 210, SunSalt: 180 },
    script: () => s1(),
  },
};

function s1() {
  checkBase("wine");
  logSkirt();
  logAddStirCauldron(5.8);
  logAddPourSolvent(Infinity);
  logAddMoonSalt(45);
  logAddStirCauldron(9.8);
  pourUntilAngle(-(20 - 11.99 + 15 * 0.36));
  stirToZone({ zone: Entity.HealZone, exitZone: true });
  straighten(degToRad(-103), SaltNames.Sun, { maxStir: 0.76 });
  logAddSunSalt(179 - getSun());
  logAddStirCauldron(0.411);
  logAddSunSalt(1);
  console.log(stirToTarget(Effects.Wine.Libido, { preStir: 9.6, maxStir: 1.0 }));
  logAddMoonSalt(165);
}
