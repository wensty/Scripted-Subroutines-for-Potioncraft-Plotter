import { Ingredients } from "@potionous/dataset";
import {
  logSkirt,
  logAddMoonSalt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToZone,
  stirToNearestTarget,
  degToRad,
  checkBase,
  straighten,
} from "../mainScript";
import { Entity, Salt, Effects } from "../mainScript";

const recipes = {
  r1: {
    title: "MagicVision-Wine",
    desc: "493s+193m",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 193, SunSalt: 493 },
    script: () => {
      checkBase("wine");
      logSkirt(0.84);
      logAddStirCauldron(4.7);
      straighten(degToRad(85), Salt.Sun, { maxGrains: 328 });
      stirToZone({ zone: Entity.DangerZone, preStir: 3, overStir: false });
      logAddSunSalt(20);
      straighten(degToRad(40), Salt.Sun, { preStir: 5, maxGrains: 145 });
      logAddStirCauldron(6.833);
      logAddPourSolvent(0.7);
      logAddMoonSalt(53);
      logAddStirCauldron(3.925);
      logAddMoonSalt(1);
      stirToNearestTarget(Effects.Wine.MagicalVision, { maxStir: 0.5 });
      logAddMoonSalt(139);
    },
  },
};
