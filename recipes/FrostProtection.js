import {
	logAddIngredient,
	logSkirt,
	logAddMoonSalt,
	// Wrapped operation instructions.
	logAddHeatVortex,
	logAddStirCauldron,
	logAddPourSolvent,
	stirIntoVortex,
	stirToVortexEdge,
	stirToTurn,
	stirToDangerZoneExit,
	stirToTarget,
	// Pouring subroutines.
	pourToVortexEdge,
	heatAndPourToEdge,
	derotateToAngle,
	// Conversions between angles, 2D vectors and directions.
	degToRad,
	radToDeg,
	getAngleEntity,
	// Extraction of other informations.
	checkBase,
	getAngle,
	// Complex subroutines.
	straighten,
	// getters and setters.
	getMoon,
	getSun,
	getStir,
} from "../mainScript";
import { SaltNames, BaseNames, Effects } from "../mainScript";

import { Ingredients } from "@potionous/dataset";

const StrongFrostProtection = { FrostProtection: 3 };
const FrostProtection = { FrostProtection: 2 };
const WeakFrostProtection = { FrostProtection: 1 };

const recipes = {
	r1: {
		title: "Frost Protection",
		desc: "Frost Protection",
		version: 3,
		base: BaseNames.Oil,
		Ingredients: { PhantomSkirt: 1, GraveTruffle: 1 },
		Salts: { SunSalt: 47 },
		Effect: StrongFrostProtection,
		script: r1,
	},
	r2: {
		title: "Frost Protection",
		desc: "Frost Protection",
		version: 3,
		base: BaseNames.Oil,
		Ingredients: { GraveTruffle: 1 },
		Salts: { MoonSalt: 1020 },
		Effect: StrongFrostProtection,
		script: r2,
	},
};

function r1() {
	checkBase(BaseNames.Oil);
	logSkirt(0.7895);
	logAddStirCauldron(4.55);
	logAddPourSolvent(0.692);
	stirIntoVortex(3.1);
	logAddHeatVortex(7);
	stirToTurn({ preStir: 7.4 });
	logAddHeatVortex(Infinity);
	logAddPourSolvent(1.82);
	stirToTurn({ preStir: 0.6 });
	logAddPourSolvent(1.748);
	stirToDangerZoneExit();
	logAddPourSolvent(1.884);
	stirToTurn({ preStir: 0.6 });
	const pre = 7;
	const d = -118.6;
	straighten(degToRad(d), SaltNames.Sun, { maxGrains: pre });
	logAddIngredient(Ingredients.GraveTruffle, 1);
	straighten(degToRad(d), SaltNames.Sun, { maxGrains: 46 - getSun() });
	stirIntoVortex(2.3);
	console.log("d: " + d);
	console.log("~d: " + radToDeg(getAngleEntity() - Math.PI));
	logAddHeatVortex(3);
	pourToVortexEdge();
	heatAndPourToEdge(0.15, 20);
	for (let i = 0; i < 26; i++) {
		logAddHeatVortex(0.148);
		stirToVortexEdge();
	}
	logAddHeatVortex(0.036);
	console.log("Total stir after edging: " + getStir().toFixed(3)); // 20.753
	stirIntoVortex(8.1);
	logAddHeatVortex(5);
	heatAndPourToEdge(1, 6);
	derotateToAngle(0);
	logAddPourSolvent(1.028);
	stirToTarget(Effects.Oil.FrostProtection, { preStir: 13.7, maxStir: 1.0 });
}

function r2() {
	const pre = 60;
	logAddMoonSalt(pre);
	logAddIngredient(Ingredients.GraveTruffle);
	derotateToAngle(0);
	stirToTurn({ preStir: 12 });
	logAddMoonSalt(134);
	stirToDangerZoneExit();
	straighten(degToRad(-74.2), SaltNames.Moon, { maxGrains: 501 + pre - getMoon() });
	// finite de-rotation
	const target = 0.265;
	logAddPourSolvent(target);
	const last = Math.ceil((getAngle() - 11.99) / 0.36);
	console.log("final: " + (getMoon() + last));
	straighten(degToRad(-87.4), SaltNames.Moon, { maxStir: 2 });
	stirToDangerZoneExit();
	logAddMoonSalt(161);
	stirToTurn();
	logAddMoonSalt(Math.ceil((getAngle() - 11.99) / 0.36) - 1);
	logAddStirCauldron(0.179);
	logAddMoonSalt(1);
	console.log(stirToTarget(Effects.Oil.FrostProtection, { preStir: 5.0 }).distance);
	// centering test
	// logAddSetPosition(-27.97,-4.09)
}
