# Scripted subroutines for Potioncraft Plotter

---

This project contains functions in javascript for the scripting system of Potioncraft plotter tool. Basically the subroutines are common optimizing techniques we used in PotionCraft game.

## the files in this repository

```
project
|   main.js
│   public-types.ts
│   README.md
|   jsconfig.json
|   .gitignore
│
└───scriptRecipes
|   │   someRecipe.js
|   │   anotherRecipe.js
|
└───localScriptRecipes
    │   someRecipe.js
```

- `main.js` : the main scripting file.
- `public-types.ts` : containing signatures of all the APIs provided by the plotter tool. Since plotter tool itself is not fully open-source, this allows you to scripting offline with intellisense support.
- `scriptRecipes` : Example recipes, containing some scripts finally made online.
- `scriptRecipes/ImportScript.js` : Containing all the exported functions. Make it easier to import functions offline when storing scripts.
- `localScriptRecipes/*.js` : Local script recipe dataset, recipes here are ignored by git. The one is forced to be added.

## How to use this collection of functions and scripted subroutines.

> Import and export on plotter is under development _and now testing on beta version_.
>
> import the function from `github:wensty/Scripted-Subroutines-for-Potioncraft-Plotter/main.js`
>
> Note that online plotter scripting accepts only one input file

### LTS version

- Copy the whole `main.js` file into the online script editor.
- Delete all the import statements. Add a `main();` statement calling the main script function.
- Write your script recipe in the `main()` function. All the defined utility functions and subroutines can be used.
- This produce a too long link to share. To share it you flatten it into a regular instruction recipe.

### beta version

- <del>import the required function from github repository.</del>
- <del>Write your script recipes.</del>
- <del>This produce a script recipe link that can be shared.</del>
- <del>but is volatile to future changes in the `main.js` file.</del>
- Still, you can copy the whole `main.js` file as in LTS version.

## What can scripts do and what _can't_ scripts do

With scripts, you can:

- Make some painful operations on plotter automatic and accurate, such as:
  - pouring/stirring to push the bottle outward to the edge of a vortex
  - Stir and adding salt to make the bottle move in an exact straight line.
  - Accurately stir to the center of an effect, or into a vortex, or out of danger zones, etc.
- Reduce the butterfly effect on modifying some steps.
  - You stir some distance into a vortex. Then you modify some step before, and it do not move into the vortex and mess up all the recipe.
  - You made a series of heating and pouring. You modify some steps before, and all the heating and pouring steps should be modified accordingly.

With scripts, you _can't_:

- Declare a recipe to be optimal.
- Easily find the optimal recipe, even with the given overall path.

Actual optimization on plotter, even with scripts, still requires skill and experience.

## credits

- `@sunset` at [PotionCraft discord](https://discord.com/channels/801182992793075743). Creator of the [potionous](https://potionous.app) app and the potionous [plotter tool](https://potionous.app/plotter).

- The [Beta version potionous](https://beta.potionous.app) and [beta plotter tool](https://beta.potionous.app/plotter)

---

## plotter public API

### instruction API `@potionous/instruction`

- `addIngredients()` and similar: add an instruction to the current plotter.
- `createAddIngredients()` and similar: do not add the instruction, instead return a instruction object. Commonly used with `computePlot()` and `currentRecipeItem`.

### plot API `@potionous/plot`

- `currentPlot` : current plot, the plot up to the current script.
- `startingPlot` : starting plot, the plot up to before the current plot.
- `currentRecipeItems` : An array of all instructions in the current plot.
- `startingRecipeItem` : An array of all instructions in the starting plot.

#### the plot object

The plot contains `committedPoints` for points on the path committed, and `pendingPoints` for points that has not be stirred and prepared to be copied to `committedPoints` on stirring. Both are arrays with `PlotPoint` items.

It is beneficial to know that bottle moves **straightly** from a node point to next one while stirring.

A `PlotPoint` item is a point on the map with the following information:

- `x` , `y`: The position of the point.
  > Currently `.x`, `.y` is `undefined` instead of `0` at origin.
- `angle` : the bottle angle at the point, left is positive and right is negative, in degree.
  > Similarly, currently `.angle` is `undefined` instead of `0` if the bottle has no rotation.
- `health` : Calculated health at the point. Since plotter add dense node point around entrance and exits of danger zones, this is not that useful.
- `bottleCollisions`: entities the bottle touches at the point, an array of `import("@potionous/dataset").PotionBaseEntity` objects. Very frequently used in detection of certain entities (Vortex, danger zones, swamps, etc)
- `source`, `isteleportation`

### dataset API `@potionous/dataset`

- `PotionBaseEntity`: Contains `entityType` for the name of the entity, and `x`, `y` for the position of the entity.
- `PotionBases.current.id`: the current base. Used in base detection code.
- `Ingredients`: in online version you can use like `Ingredients.PhantonSkirt` for ingredients. This is not implemented in the offline version.

---

## Implemented utilities and subroutines

### Important notes:

- New discovery: `createSetPosition(x, y)` can be simulated, so we can still use this API with some workaround.

- Without exceptions, directions are based on north and use radian input and output, clockwise(sun salt direction) being positive, anticlockwise(moon salt direction) being negative.

  - `derotateToAngle()` uses degree input, this is because `.angle` of points is in degrees.

- For the full details of the usages, see JSDoc.

### logged instruction

- `logAddIngredient` and similar: logged version of the instruction APIs. It print an information to console and add the instruction.

### Detection functions

Used to detection of certain entities.

- `isDangerZone`: test danger zone entities in collision of current point.
- `isStrongDangerZone`: test strong danger zone entities in collision of current point.
- `isVortex`: test vortex entities in collision of current point.

### Stirring subroutines.

- `stirIntoVortex()`: stir to a different vortex.
- `StirToEdge()`: stir to edge of the current vortex.
- `stirToTurn(maxStirLength?, directionBuffer?, leastSegmentLength?)`: stir to the point where the direction changes vastly.
  - `maxStirLength`: the maximal length it will stir.
  - `directionBuffer`: the angular threshold in radians to be considered as "vast" change.
  - `leastSegmentLength`: the minimum length between points to consider in the calculation.
- `StirIntoDangerZoneExit()`: stir to the nearest exit point of danger zone. The bottle will find a danger zone if it is not currently in.
- `stirToNearestTarget(target, options?)`: stir to the nearest point to the target position within the given maximum stir length.
  - `target`: the target effect. An object with `x` and `y` properties.
    - Can be one of the pre-defined `Effects` constant.
  - `options`: an object with the following options:
    - `preStirLength`: the stir length before the optimization. Default to `0.0`.
    - `maxStirLength`: the maximal stir length allowed in the optimization. Default to be `Infinity`.
    - `leastSegmentLength`: the minimal length of each segment in the optimization process. Default to be `1e-9`.
- `stirToTier(target, options?)`: stir to the specified tier of certain effect, adjusting the stir length based on the current angle and position.
  - `target`: the target effect. An object with `x`, `y` and `angle` properties.
    - Can be one of the pre-defined `Effects` constant.
  - `options`: an object with the following options:
    - `preStirLength`: the stir length before the optimization. Default to `0.0`.
    - `maxDeviation`: the maximum angle deviation to the target effect. Default to be `DeviationT2`, i.e. the max deviation to get tier 2 effect.
    - `ignoreAngle`: whether to ignore the angle deviation. whether T1 effects are reached is not affected by angle deviation.
    - `leastSegmentLength`: the minimal length of each segment in the optimization process. Default to be `1e-9`
    - `afterBuffer`: the buffer added after stirring. Default to be `1e-5`.
- `stirToConsume(consumeLength)`: stir to consume a specified length while in a vortex.
  - `consumeLength`: the length of stirring to consume.
  - <em>The consume is virtual</em>. Consider if it can be translated to real path consuming.

### Pouring subroutines.

- `pourToEdge()`: pour to the edge of the current vortex.
- `heatAndPourToEdge(length, repeats)`: repeatedly heating the vortex and pouring to edge of it, to move the bottle with the vortex and keep it at the boundary of the vortex.
  - `length`: the maximal length of pour. Overridden at the last stage where we can not heat too much.
  - `repeats`: the number of times to repeat the heating and pouring process.
- `pourToDangerZone(maxPourLength?)`: pour until about to enter danger zone.
  - `maxPourLength`: the maximal length it will pour.
- `pourIntoVortex(targetVortexX, targetVortexY)`: pour into the target vortex.
  - `targetVortexX`, `targetVortexY`: the rough coordinates of the target vortex.
- `derotateToAngle(targetAngle, buffer?, epsilon?)`: derotate the bottle to a target angle, can be used if the bottle is at the origin or in a vortex.
  - `targetAngle`: the target angle in degrees.
  - `buffer`, `epsilon`: the parameters for the binary search to decide exact de-rotation.
  - **Note that this de-rotation process is not real de-rotation process. Check that it can be translated back to real de-rotation before using it**.

### Angle conversion functions

- `degToRad`
- `radToDeg`
- `degToSalt`
- `radToSalt`
- `saltToDeg`
- `saltToRad`

### Angle and direction extractions

- `getDirectionByVector(x, y, baseDirection?)` : computes the direction angle of a 2D vector relative to a base direction.
  - `x`, `y`: the x and y components of the vector.
  - `baseDirection`: the base direction in radian. Default to be 0.
- `getVectorByDirection(direction, baseDirection?)` : computes a 2D vector from a direction angle and an optional base direction angle.
- `getRelativeDirection(direction, baseDirection?)` : computes the relative direction between two direction angles.
  - This is dedicated to compute the relative direction. So the base direction must be provided.
- `getBottlePolarAngle(toBottle?)`: computes the direction angle of the current bottle position.
  - `toBottle`: Boolean default to be `true`. Decide to calculate the angle toward the bottle or from the bottle.
- `getBottlePolarAngleByEntity(expectedEntityTypes, toBottle?)`: computes the direction angle of the current bottle position _relative to the center_ of the given entity touching the current bottle.
  - Renamed to include potion effect angle calculation.
  - `expectedEntityTypes`: an array of entity type names, default to be `EntityVortex=["Vortex"]`. Some constants have been defined for this.
  - `toBottle`: Boolean default to be `true`. Decide to calculate the angle toward the bottle or from the bottle.
- `getCurrentStirDirection()`: computes the direction angle of the current stir in radians.

### Extraction of other informations.

- `checkBase(expectedBase)`: checks if the current potion base is the given expected base. If not, this check produce an error.
- `getCurrentVortexRadius()`: returns the radius of the current vortex.
- `getTargetVortexInfo(targetX, targetY)`: returns the coordinates and radius of the target vortex.
  - return: `{x:number, y:number, r:number}` be a object with `x`, `y`, `r` as keys.

### Complex subroutines.

- `straighten(direction, salt, {maxStirLength?, maxGrains?, ignoreReverse?,preStirLength?, leastSegmentLength?})`: straighten the potion path with rotation salts, i.e. automatically adding proper number of rotation salt while stirring to make the potion path straight.
  - `direction`: the direction to be stirred in radian.
  - `salt`: the type of salt to be added, it must be "moon" or "sun".
  - `maxStirLength`, `maxGrains`: stopping conditions of the straightening process. Default to be `Infinity`, i.e. stopping condition not set.
  - `preStirLength`: the amount of stirring to be added before the straightening process. Default to be `0`.
  - `ignoreReverse`: Controls the behavior when reversed direction(i.e. should add another rotation salt to bend it to the given direction) is detected. If set, no salt will be added and the process continues. If not set, the function terminate when a reversed direction is detected.
    - Default to be `true`, i.e. not set the reversed direction terminate condition.
  - Generally you should set at least one of the terminate condition.
  - Straightening is important for many highly-salty recipes with brute-force bending of path, like `AntiMagic-15m-1115s.js`.
    > Under some assumption, we can prove that that the optimal path is:
    >
    > 1. a part of the ingredient.
    > 2. a straightened part.
    > 3. last part of the ingredient.
    >    And there are geometric relations between the straighten direction and some other directions.

### Other utilities

- `getUnit(x,y)`: get the unit vector of the vector (x, y).
- `getTotalMoon()`: get the total amount of moon salt added so far _in this script_.
- `getTotalSun()`: get the total amount of sun salt added so far _in this script_.
- `setDisplay(display)`: set the display mode of the plotter.
  - `display`: `true` or `false`.
- `setStirRounding(stirRounding)`: set the stir rounding mode of the plotter. This mode rounds most numbers to 3 digits after the decimal point, same as manual instructions on the online plotter.
  - `stirRounding`: `true` or `false`.
  - some operations that potentially require high precision is not rounded. For example stirring to certain target effect.
- `logError()`: log the current error.
- `logSalt()`: log the current moon salt and sun salt used, since plotter scripting do not calculate it automatically.
  - All functions related to salt usage have grains as return value. This can be used to manually calculate the salt usage.

### Constants

- `SaltAngle`: the angle of one grain of rotation salt in radian.
- `VortexRadiusLarge`, `VortexRadiusMedium`, `VortexRadiusSmall`: the radius of the vortex. The value is `2.39`, `1.99`, `1.74` respectively.
- `DeviationT2`, `DeviationT3`, `DeviationT1`: the deviation of the vortex. The value is `600`, `100`, `2754` respectively.
- `EntityVortex`, `EntityPotionEffect`, `EntityDangerZone`, `EntityStrongDangerZone`: Predefined arrays of related entity names.
- `Salt.Moon`, `Salt.Sun`: Predefined salt names.

---
