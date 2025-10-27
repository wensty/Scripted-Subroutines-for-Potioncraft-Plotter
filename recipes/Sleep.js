import {
  logSkirt,
  logAddSunSalt,
  logAddHeatVortex,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  heatAndPourToEdge,
  derotateToAngle,
  degToRad,
  radToDeg,
  getAngleEntity,
  checkBase,
  straighten,
} from "../mainScript";

const recipes = {
  r1: {
    title: "Sleep",
    desc: "",
    version: 3,
    base: "water",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 407 },
    script: () => {
      checkBase("water");
      logAddSunSalt(87);
      logSkirt();
      logAddSunSalt(21);
      logAddStirCauldron(3);
      straighten(degToRad(105.5), "sun", { maxGrains: 253 - 21 });
      logAddStirCauldron(12.245);
      logAddHeatVortex(2);
      derotateToAngle(0);
      heatAndPourToEdge(0.3, 20);
      logAddHeatVortex(5.9);
      straighten(degToRad(129), "sun", { preStir: 10.5, maxGrains: 67 });
      stirIntoVortex(5.0);
      console.log(radToDeg(getAngleEntity()) + 180);
      logAddHeatVortex(5.12);
      derotateToAngle(0);
      logAddPourSolvent(4.129);
    },
  },
};
