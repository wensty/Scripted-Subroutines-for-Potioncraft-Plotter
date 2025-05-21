import {
  logAddIngredient,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToNearestTarget,
  pourToDangerZone,
  derotateToAngle,
  degToRad,
  getRelativeDirection,
  getBottlePolarAngle,
  getCurrentStirDirection,
  checkBase,
  straighten,
} from "../main";
import { Ingredients } from "@potionous/dataset";

function main() {
  checkBase("wine");
  logAddSunSalt(335);
  logAddIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(0);
  straighten(Infinity, degToRad(-65), "sun", 200);
  logAddStirCauldron(7.66);
  logAddSunSalt(39);
  logAddStirCauldron(0.9);
  logAddSunSalt(40);
  stirToTurn();
  straighten(Infinity, getBottlePolarAngle(), "sun", 301 - 39 - 40);
  logAddPourSolvent(0.8);
  straighten(Infinity, getBottlePolarAngle(), "sun", 39);
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
    stirToTurn(0.1 * SaltAngle);
    pourToDangerZone(1);
  }
  logAddSunSalt(1225 - TotalSun);
  for (let i = 0; i < 38; i++) {
    stirToTurn(0.1 * SaltAngle);
    pourToDangerZone(1);
  }
  logAddStirCauldron(0.1);
  logAddPourSolvent(0.166);
  stirToNearestTarget(-19.45, 14.64);
}

function beta_1226s() {
  checkBase("wine");
  logAddSunSalt(335);
  logAddIngredient("PhantomSkirt", 1);
  derotateToAngle(0);
  straighten(Infinity, degToRad(-65), "sun", 200);
  logAddStirCauldron(7.66);
  logAddSunSalt(39);
  logAddStirCauldron(0.9);
  logAddSunSalt(40);
  stirToTurn();
  straighten(Infinity, getBottlePolarAngle(), "sun", 301 - 39 - 40);
  logAddPourSolvent(0.8);
  straighten(Infinity, getBottlePolarAngle(), "sun", 39);
  logAddPourSolvent(0.05);
  stirToTurn();
  logAddPourSolvent(0.54);
  logAddStirCauldron(4.53);
  logAddSunSalt(30);
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
    stirToTurn(Infinity, 0.001 * SaltAngle);
    pourToDangerZone(0.4);
  }
  logAddSunSalt(1226 - TotalSun);
  for (let i = 0; i < 47; i++) {
    stirToTurn(0.1, 0.1 * SaltAngle);
    pourToDangerZone(0.15);
  }
  // New technique to avoid pouring centering.
  logAddStirCauldron(0.825);
  logAddPourSolvent(0.14);
  console.log(stirToNearestTarget(-19.45, 14.64));
}
