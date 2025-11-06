import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirToTurn,
  stirToTarget,
  derotateToAngle,
  degToRad,
  radToDeg,
  saltToDeg,
  vecToDir,
  checkBase,
  straighten,
  vSub,
  getCoord,
  getTotalSun,
} from "../mainScript";
import { SaltNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const recipes = {
  r1: {
    title: "Hallucinations",
    desc: "Hallucinations",
    version: 3,
    base: "wine",
    tier: 3,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { SunSalt: 826 },
    script: r1,
  },
};

function r1() {
  checkBase("wine");
  logAddSunSalt(70);
  logSkirt();
  derotateToAngle(saltToDeg("sun", 53 - 0.9));
  const direction = degToRad(28.4);
  straighten(direction, SaltNames.Sun, { maxGrains: 167 });
  const p1 = getCoord();
  stirToTurn({ preStir: 7 });
  const p2 = getCoord();
  console.log("Direction of concave part: " + radToDeg(vecToDir(vSub(p2, p1))));
  const s1 = Math.ceil((180.01 + currentPlot.pendingPoints[0].angle) / 0.36);
  straighten(direction, SaltNames.Sun, { maxGrains: s1 });
  logAddStirCauldron(0.7);
  logAddPourSolvent(6.34);
  const s2 = Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36);
  console.log("Final salt after main pouring: " + (getTotalSun() + s2));
  console.log(
    "Final salt after last pouring: " +
      (getTotalSun() + Math.ceil((currentPlot.pendingPoints[0].angle - 12) / 0.36))
  );
  straighten(degToRad(48.5), SaltNames.Sun, {
    preStir: 9.7,
    maxStir: 1.3,
    maxGrains: 825 - getTotalSun(),
  });
  // for(var x=0.77;x<0.79;x+=0.001){
  //   setVirtual();
  //   logAddStirCauldron(x)
  //   logAddSunSalt(1)
  //   console.log(x)
  //   console.log(stirToTarget(Effects.Wine.Hallucinations,{preStir:3.5}));
  // }
  logAddStirCauldron(0.784);
  logAddSunSalt(1);
  stirToTarget(Effects.Wine.Hallucinations, { preStir: 3.7 });
}
