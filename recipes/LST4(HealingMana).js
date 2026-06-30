import {
  logSkirt,
  logAddMoonSalt,
  stirToTarget,
  derotateToAngle,
  degToRad,
  checkBase,
  getDeviation,
  straighten,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

const LST4 = {
  Healing: 3,
  Mana: 2,
};

const recipes = {
  r1: {
    title: "LST4",
    desc: "",
    version: "betaV3",
    base: BaseNames.Wine,
    Ingredients: { PhantomSkirt: 1 },
    Salts: { MoonSalt: 146, SunSalt: 13 },
    Effects: LST4,
    script: r1,
  },
};

function r1() {
  checkBase(BaseNames.Wine);
  logAddMoonSalt(146);
  logSkirt();
  derotateToAngle(39.271, { toAngle: false });
  stirToTarget(Effects.Wine.Healing, { preStir: 3.9, maxStir: 1.0 });
  console.log(getDeviation(Effects.Wine.Healing));
  straighten(degToRad(90), SaltNames.Sun, { maxGrains: 13 });
  stirToTarget(Effects.Wine.Mana, { preStir: 10.9, maxStir: 1.0 });
  console.log(getDeviation(Effects.Wine.Mana));
}
