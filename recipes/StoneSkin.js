import {
  logAddIngredient,
  logAddHeatVortex,
  stirIntoVortex,
  stirToVortexEdge,
  stirToConsume,
  pourToVortexEdge,
  heatAndPourToEdge,
  stirToNearestTarget,
  Effects,
  checkBase,
} from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const recipes = {
  r1: {
    title: "StoneSkin-classic",
    desc: "Interesing recipe from CN community.",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: {
      Goldthorn: 1,
      DruidsRosemary: 1,
    },
    Salts: {},
    script: () => {
      checkBase("water");
      logAddIngredient(Ingredients.Goldthorn, 0.774);
      logAddIngredient(Ingredients.DruidsRosemary);
      stirIntoVortex();
      stirToConsume(11.12);
      logAddHeatVortex(Infinity);
      stirIntoVortex();
      logAddHeatVortex(2);
      pourToVortexEdge();
      heatAndPourToEdge(1, 9);
      logAddHeatVortex(2);
      for (let i = 0; i < 10; i++) {
        stirToVortexEdge();
        logAddHeatVortex(0.1);
      }
      logAddHeatVortex(1.4);
      stirToNearestTarget(Effects.Water.StoneSkin);
    },
  },
};
