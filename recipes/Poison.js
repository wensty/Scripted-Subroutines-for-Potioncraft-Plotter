import {
  logAddIngredient,
  logAddMoonSalt,
  logAddStirCauldron,
  stirToTarget,
  // Conversions between angles, 2D vectors and directions.
  degToRad,
  // Extraction of other informations.
  checkBase,
  getDeviation,
  // Complex subroutines.
  straighten,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

function r1() {
  checkBase(BaseNames.Oil);
  const a = -135;
  const s1 = 1;
  const s2 = 15;
  const s3 = 24;
  logAddIngredient(Ingredients.StinkMushroom);
  straighten(degToRad(a), SaltNames.Moon, { maxGrains: s1, preStir: 1.0 });
  straighten(degToRad(a), SaltNames.Sun, { maxGrains: s2, preStir: 1.7 });
  straighten(degToRad(a), SaltNames.Moon, { maxGrains: s3 - s1 - 1, preStir: 1.7 });
  logAddStirCauldron(0.025);
  logAddMoonSalt(1);
  stirToTarget(Effects.Oil.Poison);
  console.log(getDeviation(Effects.Oil.Poison));
}
