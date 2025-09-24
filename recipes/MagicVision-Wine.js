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
} from "../main";
import { Entity, Salt, Effects } from "../main";

/**
 * 493s+193m
 */
function beta() {
  checkBase("wine");
  logSkirt(0.84);
  logAddStirCauldron(4.7);
  straighten(degToRad(85), Salt.Sun, { maxGrains: 328 });
  stirToZone({ zone: Entity.DangerZone, preStirLength: 3, overStir: false });
  logAddSunSalt(20);
  straighten(degToRad(40), Salt.Sun, { preStirLength: 5, maxGrains: 145 });
  logAddStirCauldron(6.833);
  logAddPourSolvent(0.7);
  logAddMoonSalt(53);
  logAddStirCauldron(3.925);
  logAddMoonSalt(1);
  stirToNearestTarget(Effects.Wine.MagicalVision, { maxStirLength: 0.5 });
  logAddMoonSalt(139);
}
