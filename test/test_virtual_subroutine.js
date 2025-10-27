import {
  logSkirt,
  logAddSunSalt,
  logAddStirCauldron,
  logAddPourSolvent,
  stirIntoVortex,
  setVirtual,
  unsetVirtual,
} from "../mainScript";

function testVirtualMode() {
  logAddSunSalt(20);
  logSkirt();
  let optimalStir;
  let optimalTotalStir = Infinity;
  for (let d = 5.0; d < 5.5; d += 0.01) {
    setVirtual();
    logAddStirCauldron(d);
    logAddPourSolvent(Infinity);
    const totalStir = stirIntoVortex(5).distance + d;
    if (totalStir < optimalTotalStir) {
      optimalStir = d;
      optimalTotalStir = totalStir;
    }
  }
  // console.log(stirIntoVortex(3))
  console.log(optimalStir);
  unsetVirtual();
  logAddStirCauldron(optimalStir);
  logAddPourSolvent(Infinity);
  stirIntoVortex(5);
  console.log(optimalStir);
}
