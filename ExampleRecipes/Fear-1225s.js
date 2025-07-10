import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToNearestTarget,
  pourToZone,
  derotateToAngle,
  degToRad,
  getRelativeDirection,
  getBottlePolarAngle,
  getCurrentStirDirection,
  checkBase,
  straighten,
  getTotalSun,
} from "../main";
import { SaltAngle, Effects } from "../main";

function main() {
  checkBase("wine");
  logAddSunSalt(335);
  logSkirt();
  derotateToAngle(0);
  straighten(degToRad(-65), "sun", { maxGrains: 200 });
  logAddStirCauldron(7.66);
  logAddSunSalt(39);
  logAddStirCauldron(0.9);
  logAddSunSalt(40);
  stirToTurn();
  straighten(getBottlePolarAngle(), "sun", { maxGrains: 301 - 39 - 40 });
  logAddPourSolvent(0.8);
  straighten(getBottlePolarAngle(), "sun", { maxGrains: 39 });
  logAddPourSolvent(0.05);
  stirToTurn();
  logAddPourSolvent(0.56);
  logAddStirCauldron(4.53);
  logAddSunSalt(30);
  logAddStirCauldron(1.61);
  logAddSunSalt(55);
  logAddStirCauldron(2.01);
  for (let i = 0; i < 39; i++) {
    const bottlePolarAngle = getBottlePolarAngle();
    const currentDirection = getCurrentStirDirection();
    const relativeDirection = getRelativeDirection(currentDirection, bottlePolarAngle);
    if (relativeDirection < -SaltAngle / 2) {
      logAddSunSalt(Math.round(-relativeDirection / SaltAngle));
    }
    stirToTurn({ directionBuffer: 0.1 * SaltAngle });
    pourToZone(1);
  }
  logAddSunSalt(1225 - getTotalSun());
  for (let i = 0; i < 38; i++) {
    stirToTurn({ directionBuffer: 0.1 * SaltAngle });
    pourToZone(1);
  }
  logAddStirCauldron(0.1);
  logAddPourSolvent(0.166);
  stirToNearestTarget(Effects.Wine.Fear);
}
function beta_1226s() {
  checkBase("wine");
  logAddSunSalt(335);
  logSkirt();
  derotateToAngle(0);
  straighten(degToRad(-65), "sun", { maxGrains: 200 });
  logAddStirCauldron(7.66);
  logAddSunSalt(39);
  logAddStirCauldron(0.9);
  logAddSunSalt(40);
  stirToTurn();
  straighten(getBottlePolarAngle(), "sun", { maxGrains: 301 - 39 - 40 });
  logAddPourSolvent(0.8);
  straighten(getBottlePolarAngle(), "sun", { maxGrains: 39 });
  logAddPourSolvent(0.05);
  stirToTurn();
  logAddPourSolvent(0.54);
  logAddStirCauldron(4.53);
  logAddSunSalt(29);
  logAddStirCauldron(1.61);
  logAddSunSalt(59);
  logAddStirCauldron(2.13);
  for (let i = 0; i < 43; i++) {
    const bottlePolarAngle = getBottlePolarAngle();
    const currentDirection = getCurrentStirDirection();
    const relativeDirection = getRelativeDirection(currentDirection, bottlePolarAngle);
    if (relativeDirection < -SaltAngle / 2) {
      logAddSunSalt(Math.round(-relativeDirection / SaltAngle));
    }
    stirToTurn({ maxStirLength: 0.0, directionBuffer: 0 });
    pourToZone(0.4);
  }
  logAddSunSalt(1225 - getTotalSun());
  for (let i = 0; i < 62; i++) {
    stirToTurn({ maxStirLength: 0.0, directionBuffer: 0 });
    pourToZone(0.15);
  }
  // New technique to avoid pouring centering.
  logAddStirCauldron(0.3);
  logAddPourSolvent(0.036);
  console.log(stirToNearestTarget(Effects.Wine.Fear));
  logAddSunSalt(1); // do not enough derorate.
}
