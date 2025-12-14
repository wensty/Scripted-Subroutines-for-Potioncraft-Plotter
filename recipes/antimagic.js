import {
  logSkirt,
  logAddSunSalt,
  // Wrapped operation instructions.
  logAddHeatVortex,
  logAddStirCauldron,
  stirIntoVortex,
  stirToTurn,
  stirToTarget,
  heatAndPourToEdge,
  derotateToAngle,
  // Conversions between angles, 2D vectors and directions.
  degToRad,
  radToDeg,
  degToSalt,
  saltToDeg,
  vecToDir,
  vecToDirCoord,
  getAngleEntity,
  // Extraction of other informations.
  checkBase,
  // Complex subroutines.
  straighten,
  vSub,
  getSun,
  getStir,
  getCoord,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { currentPlot } from "@potionous/plot";

const StrongAntiMagic = { AntiMagic: 3 };
const AntiMagic = { AntiMagic: 2 };
const WeakAntiMagic = { AntiMagic: 1 };

const recipes = {
  r1: {
    title: "Antimagic",
    desc: "Antimagic",
    version: 3,
    base: BaseNames.Oil,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { Moonsalt: 2, SunSalt: 1107 },
    Effects: StrongAntiMagic,
    script: r1,
  },
};

function r1() {
  checkBase(BaseNames.Oil);
  logAddSunSalt(26);
  logAddSunSalt(141);
  logSkirt();
  derotateToAngle(saltToDeg(SaltNames.Sun, 25.5));
  stirIntoVortex();
  logAddHeatVortex(Infinity);
  straighten(degToRad(31.6), SaltNames.Sun, { preStir: 1.5, maxGrains: 309 });
  logAddStirCauldron(6.35);
  logAddSunSalt(35);
  logAddStirCauldron(0.92);
  logAddSunSalt(30);
  const p1 = getCoord();
  stirToTurn();
  const p2 = getCoord();
  let direction = vecToDir(vSub(p2, p1));
  console.log("direction: " + radToDeg(direction));
  straighten(direction, SaltNames.Sun, { maxGrains: 900 - getSun() });
  straighten(direction, SaltNames.Moon, { maxGrains: 2 });
  stirIntoVortex();
  console.log("~direction:" + (radToDeg(getAngleEntity()) + 180));
  console.log(getStir());
  heatAndPourToEdge(0.1, 31);
  logAddHeatVortex(2.428);
  console.log(degToSalt(-currentPlot.pendingPoints[0].angle));
  derotateToAngle(saltToDeg(SaltNames.Moon, 207) - 11.99);
  const { x: x1, y: y1 } = getCoord();
  const d3 = vecToDirCoord(32.77 - x1, 29.94 - y1);
  straighten(d3, SaltNames.Sun, { maxStir: 4, maxGrains: 206 });
  logAddStirCauldron(0.319);
  logAddSunSalt(1);
  console.log(stirToTarget(Effects.Oil.AntiMagic, { preStir: 2 }).distance);
}
