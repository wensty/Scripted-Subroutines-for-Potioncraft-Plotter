import {
  logSkirt,
  logAddMoonSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  stirToVortexEdge,
  stirToNearestTarget,
  heatAndPourToEdge,
  getBottlePolarAngle,
  getCurrentStirDirection,
} from "../main.js";
import { Effects } from "../main.js";

const recipes = {
  r1: {
    title: "Lightning",
    desc: "",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 234 },
    script: () => {
      logSkirt();
      logAddStirCauldron(4.55);
      console.log(getCurrentStirDirection());
      console.log(getBottlePolarAngle());
      logAddPourSolvent(0.692);
      stirIntoVortex();
      heatAndPourToEdge(1, 7);
      logAddHeatVortex(2.092);
      for (let i = 0; i < 14; i++) {
        logAddHeatVortex(0.1);
        stirToVortexEdge();
      }
      logAddHeatVortex(0.036);
      stirToVortexEdge();
      stirIntoVortex(6);
      logAddHeatVortex(4);
      logAddPourSolvent(0.172);
      logAddHeatVortex(3.948);
      stirToVortexEdge();
      for (let i = 0; i < 14; i++) {
        logAddHeatVortex(0.1);
        stirToVortexEdge();
      }
      logAddStirCauldron(2.96);
      logAddMoonSalt(234);
      stirToNearestTarget(Effects.Oil.Lightning, { preStirLength: 15 });
    },
  },
};
