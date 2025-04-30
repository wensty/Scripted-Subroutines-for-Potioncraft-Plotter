import { derotateToAngle, stirIntoVortex, straighten } from '../main.js';
import { degToRad } from '../main.js';

import {
  addIngredient,
  addSunSalt,
  addMoonSalt,
  addHeatVortex,
  addStirCauldron,
} from '@potionous/instructions';

import { Ingredients } from '@potionous/dataset';
import { currentPlot } from '@potionous/plot';

function main() {
  addSunSalt(29);
  addSunSalt(138);
  addIngredient(Ingredients.PhantomSkirt, 1);
  derotateToAngle(saltToDeg('sun', 29));
  stirIntoVortex();
  addHeatVortex(Infinity);
  straighten(3, degToRad(17.6), 'sun', 9999, true);
  addStirCauldron(6);
  let direction = getAngleByDirection(
    29.63 - currentPlot.pendingPoints[0].x,
    21.91 - currentPlot.pendingPoints[0].y
  );
  addSunSalt(37);
  addStirCauldron(3.3);
  straighten(Infinity, direction + degToRad(0.0), 'sun', 400, false);
  straighten(Infinity, direction + degToRad(0.0), 'moon', 20, true);
  stirIntoVortex();
  continuousPourToEdge(0.2, 1, 13);
  addHeatVortex(2.5);
  straighten(4, degToRad(11.6), 'sun', 208, true);
  addStirCauldron(0.78);
  addSunSalt(1);
  addStirCauldron(3.758);
}
