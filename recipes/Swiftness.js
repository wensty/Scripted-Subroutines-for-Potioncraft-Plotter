import {
	logAddIngredient,
	logAddMoonSalt,
	logAddStirCauldron,
	logAddPourSolvent,
	stirToDangerZoneExit,
	stirToTarget,
	pourToZone,
	degToRad,
	checkBase,
	straighten,
	getMoon,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongSwiftness = { Swiftness: 3 };
const Swiftness = { Swiftness: 2 };
const WeakSwiftness = { Swiftness: 1 };

const recipes = {
	r1: {
		title: "Swiftness",
		desc: "cost-optimized",
		version: "V3Beta",
		base: BaseNames.Wine,
		Ingredients: { Windbloom: 1, WitchMushroom: 1 },
		Salts: { MoonSalt: 92 },
		effect: StrongSwiftness,
		script: r1,
	},
	r2: {
		title: "Swiftness",
		desc: "ing-optimized water-cap version",
		version: "V3Beta",
		base: BaseNames.Wine,
		Ingredients: { Watercap: 1 },
		Salts: { MoonSalt: 202 },
		effect: StrongSwiftness,
		script: r2,
	},
};

function r1() {
	checkBase(BaseNames.Wine);
	const pre = 35;
	logAddIngredient(Ingredients.Windbloom);
	logAddMoonSalt(pre);
	logAddIngredient(Ingredients.WitchMushroom);
	logAddMoonSalt(63 - getMoon());
	logAddStirCauldron(11.109);
	logAddMoonSalt(1);
	console.log(stirToTarget(Effects.Wine.Swiftness, { preStir: 1.2 }).distance);
	logAddMoonSalt(92 - getMoon());
}
function r2() {
	logAddIngredient(Ingredients.Watercap);
	straighten(degToRad(-70), SaltNames.Moon, { maxGrains: 202 });
	stirToDangerZoneExit(8.4);
	for (let i = 0; i < 10; i++) {
		logAddStirCauldron(0.1);
		pourToZone();
	}
	logAddStirCauldron(0.1);
	logAddPourSolvent(0.02);
	logAddStirCauldron(0.1);
	logAddPourSolvent(0.092);
	logAddStirCauldron(0.1);
	logAddPourSolvent(0.236);
	console.log(stirToTarget(Effects.Wine.Swiftness, { preStir: 1.2, maxStir: 0.6 }));
}
