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
└───exampleRecipes
|   │   someRecipe.js
|   │   anotherRecipe.js
|
└───recipes
    │   someRecipe.js
```

- `main.js` : the main scripting file.
- `public-types.ts` : containing signatures of all the APIs provided by the plotter tool. Since plotter tool itself is not fully open-source, this allows you to scripting offline with intellisense support.
- `exampleRecipes` : Example recipes, containing some scripts finally made online.
- `exampleRecipes/ImportScript.js` : Containing all the exported functions. Make it easier to import functions offline when storing scripts.
- `recipes/*.js` : Script recipe dataset. May not get updated when main file is updated.

---

## How to use this collection of functions and scripted subroutines.

<!--
> Import and export on plotter is under development _and now testing on beta version_.
>
> import the function from `github:wensty/Scripted-Subroutines-for-Potioncraft-Plotter/main.js`
>
> Note that online plotter scripting accepts only one input file -->

### LTS version

- Copy the whole `main.js` file into the online script editor.
- Delete all the export statements. Add a `main();` statement calling the main script function.
- Write your script recipe in the `main()` function. All the defined utility functions and subroutines can be used.
- This produce a too long link to share. To share it you flatten it into a regular instruction recipe.
<!--

### beta version

- <del>import the required function from github repository.</del>
- <del>Write your script recipes.</del>
- <del>This produce a script recipe link that can be shared.</del>
- <del>but is volatile to future changes in the `main.js` file.</del>
- Still, you can copy the whole `main.js` file as in LTS version. -->

---

## What can scripts do and what _can't_ scripts do

With scripts, you can:

- **Make some painful operations** to be **automatic and accurate** on plotter, such as:
  - pouring/stirring to push the bottle outward to the edge of a vortex
  - Stir and adding salt to make the bottle move in an exact straight line.
  - Accurately stir to the center of an effect, or into a vortex, or out of danger zones, etc.
- **Reduce the butterfly effect** on modifying some steps.
  - You stir some distance into a vortex. Then you modify some step before, and it do not move into the vortex and mess up all the recipe.
  - You made a series of heating and pouring. You modify some steps before, and all the heating and pouring steps should be modified accordingly.

With scripts, you **can't**:

- Declare a recipe to be optimal.
- Easily find the optimal recipe, even with the given overall path.

Actual optimization on plotter, even with scripts, still requires skill and experience.

---

## credits

- `@sunset` at [PotionCraft discord](https://discord.com/channels/801182992793075743). Creator of the [potionous](https://potionous.app) app and the [potionous plotter tool](https://potionous.app/plotter).

- The [Beta version potionous](https://beta.potionous.app) and [beta version plotter tool](https://beta.potionous.app/plotter)

---

## plotter public API

### instruction API `@potionous/instruction`

- `addIngredients()` and similar: add an instruction to the current plotter.
- `createAddIngredients()` and similar: do not add the instruction, instead return a instruction object. Commonly used with `computePlot()` and `currentRecipeItem`.

### plot API `@potionous/plot`

- `currentPlot` : current plot, the plot up to the current script.
- `startingPlot` : starting plot, the plot up to before the current plot.
- `currentRecipeItems` : An array of all instructions in the current plot.
- `startingRecipeItems` : An array of all instructions in the starting plot.

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

### Very Important notes:

- **Virtual mode** is designed to automatically trying out recipes without overwriting the actual plot. When **entering** virtual mode a virtual plot and an instruction list is saved and initialized by **the current plot**, and all functions will add instruction to this virtual plot. The function to enter virtual mode is `setVirtual()` and the function to exit virtual mode is `unsetVirtual()`.
  - The function to enter virtual mode will also save the current recipe items to `VirtualRecipeItems` and the current plot to `VirtualPlot`, so it is also used to **reset** the virtual mode.
- All functions **return the instruction or instruction list** they added(or virtually added in virtual mode). You can use them to make some calculations.
  - Only exception is `stirToTarget`. It returns an object, with field `instruction` returning the instruction added and the field `distance` returning the optimal distance to the target.
- Without exceptions, directions are **based on north** and use **radian** input and output, clockwise(sun salt direction) being positive, anticlockwise(moon salt direction) being negative.
  - The only exceptions are `derotateToAngle()` and `pourUntilAngle()`.They use **degree** input, this is because `.angle` of points is in degrees.
- For the full details of the usages, see the JS Documentation of the functions in the main script.

### logged instruction

- `logAddIngredient` and similar: logged version of the instruction APIs. It print an information to console and add the instruction.

### Detectors

Used to detection of certain entities.

- `isEntityType(expectedEntityTypes)`: test given entity types. Some entity types are pre-defined by `Entity` object.
  - `isVortex`: test vortex entities.

### Stirring subroutines.

- `stirIntoVortexV2({preStir?=0.0})`: stir to a different vortex.
  - `preStir`: stir the length before stirring to vortex. Accelerate the script.
  - `stirIntovortex(preStir?=0.0)`: Compatibility version.
- `StirToVortexEdgeV2({preStir?=0.0})`: stir to edge of the current vortex.
  - `preStir`: stir the length before stirring to edge of vortex. Accelerate the script.
  - `stirToVortexEdge(preStir?=0.0)`: Compatibility version.
- `stirToTurn(option={})`: stir to the point where the direction changes vastly.
  - `option.preStir`: the stir length before stirring to turn.
  - `option.maxStir`: the maximal length it will stir.
  - `option.directionBuffer`: the angular threshold in radians to be considered as "vast" change.
  - `option.segmentLength`: the minimum length between points to consider in the calculation.
- `StirToZone(options={})`: stir to given zone. Can be configured to enter or leave the given zone, or stop before or after the point.
  - `options.zone`: the zone to stir to. Recommended to be danger zones, swamps or heal zones.
  - `options.preStir`: the stir length before stirring to zone. To accelerate the script.
  - `options.overStir`: Set to stir a bit more to ensure entrance or exit.
  - `options.exitZone`: Set to exit the given zone.
- `StirIntoDangerZoneExit()`: special case of last function to stir to the nearest point outside of the nearest danger zone.
- `stirToTarget(target, options?)`: stir to the nearest point to the target position within the given maximum stir length.
  - `target`: the target effect. An object with `x` and `y` properties.
    - Can be one of the pre-defined `Effects` constant.
  - `options`: an object with the following options:
    - `preStir`: the stir length before the optimization. Default to `0.0`.
    - `maxStir`: the maximal stir length allowed in the optimization. Default to be `Infinity`.
    - `segmentLength`: the minimal length of each segment in the optimization process. Default to be `1e-9`.
- `stirToTier(target, options?)`: stir to the specified tier of certain effect, adjusting the stir length based on the current angle and position.
  - `target`: the target effect. An object with `x`, `y` and `angle` properties.
    - Can be one of the pre-defined `Effects` constant.
  - `options`: an object with the following options:
    - `preStir`: the stir length before the optimization. Default to `0.0`.
    - `deviation`: the maximum angle deviation to the target effect. Default to be `DeviationT2`, i.e. the max deviation to get tier 2 effect.
    - `ignoreAngle`: whether to ignore the angle deviation. whether T1 effects are reached is not affected by angle deviation.
    - `segmentLength`: the minimal length of each segment in the optimization process. Default to be `1e-9`
    - ``afterStir`: the additional stir length to ensure entrance. Default to be `1e-5`
- `stirToConsume(consumeLength)`: stir to consume a specified length while in a vortex.
  - <em>Generally you can move the bottle fairly free with heating inside a vortex, so you can carefully stir and heating, so the bottle do not move as you stir. This process is called "consuming" path in a vortex. This function does a virtual consuming process using tp(to ensure the current point definitely do not move), so consider if it can be translated into a real path consuming process and the possily unavoidable solvent pouring.</em>
  - `length`: the length of stirring to consume.
  - `oneStir`: The maximal length of a single stir before teleporting back to the starting point.

### Pouring subroutines.

- `pourToVortexEdge()`: pour to the edge of the current vortex.
- `heatAndPourToEdge(length, repeats)`: repeatedly heating the vortex and pouring to edge of it, to move the bottle with the vortex and keep it at the boundary of the vortex.
  - `length`: the maximal length of pour. Overridden at the last stage where we can not heat too much.
  - `repeats`: the number of times to repeat the heating and pouring process.
- `pourtoZoneV2(options)`: pour to the assigned zone with more control options.
  - `options`: an object with the following options:
    - `zone`: the zone to pour towards. Default to be `Entity.DangerZone`.
    - `maxPour`: the maximal length it will pour.
    - `prePour`: the initial length of pouring.
    - `overPour`: whether to pour **slightly** more than the minimum required to ensure into or exit the zone.
    - `exitZone`: whether to exit the zone instead of entering it.
- `pourToZone(maxPourLength, zone?)`: special case that pour and stop before the zone. For old recipe script compatibility.
- `pourIntoVortex(x, y)`: pour into the target vortex.
  - `x`, `y`: the rough coordinates of the target vortex.
- `derotateToAngle(targetAngle, {toAngle?})`: de-rotate the bottle to a target angle **at origin or in a vortex without moving the bottle.**
  - `targetAngle`: the target angle **in degrees**.
  - `toAngle`: de-rotate to the target angle or by the target angle.
  - **Note that this de-rotation process is not real de-rotation process. Check that it can be translated back to real de-rotation before using it**.
- `pourUntilAngle(targetAngle,{minPour = 0.0,maxPour?,epsHigh?,epsLow?,buffer?,overPour?})`: pour until the bottle is at the target angle. This will **move the bottle toward origin**.
  - `targetAngle`: the target angle **in degrees**.
  - `minPour`: the optional minimal length of pouring provide to accelerate search. Default to be `0.0`.
  - `maxPour`: the optional maximal length of pouring provide to accelerate search. Default to be `Infinity`.
  - `epsHigh`: the precision for high range binary search. Default to be `EpsHigh` with value `2e-3`.
  - `epsLow`: the precision for low range binary search. Default to be `EpsLow` with value `1e-4`.
  - `buffer`: the buffer value for adjusting the binary search range. Default to be `0.012`.
  - `overPour`: whether to slightly over pour. Default to be `true`.
    - The pour not enough to bring the bottle back to origin have a smallest step size, and in these cases there are some error in the resulted angle, this parameter controls **the direction of this error** (to pour more or pour less).

### Angle conversion functions

- `degToRad`
- `radToDeg`
- `degToSalt`
- `radToSalt`
- `saltToDeg`
- `saltToRad`

### Angle and direction conversions

- `vecToDir(v, baseDirection?)` : computes the direction angle of a 2D vector relative to a base direction.
  - `v`: the 2D vector.
  - `baseDirection`: the base direction in radian. Default to be 0.
- `vecToDirCoord(x, y, baseDirection?)` : the same as `vecToDir` but with coordinates.
  - `x`, `y`: the x and y components of the vector.
  - `baseDirection`: the base direction in radian. Default to be 0.
- `dirToVec(direction, baseDirection?)` : computes a 2D vector from a direction angle and an optional base direction angle.
- `relDir(direction, baseDirection?)` : computes the relative direction between two direction angles.
  - This is dedicated to compute the relative direction. So the base direction must be provided.

### Extraction of information.

- `getAngleOrigin(toBottle?)`: computes the direction angle of the current bottle position.
  - `toBottle`: Boolean default to be `true`. Decide to calculate the angle toward the bottle or from the bottle.
- `getAngleEntity(expectedEntityTypes, toBottle?)`: computes the direction angle of the current bottle position _relative to the center_ of the given entity touching the current bottle.
  - Renamed to include potion effect angle calculation.
  - `expectedEntityTypes`: an array of entity type names, default to be `EntityVortex=["Vortex"]`. Some constants have been defined for this.
  - `toBottle`: Boolean default to be `true`. Decide to calculate the angle toward the bottle or from the bottle.
- `getStirDirection()`: computes the direction of stirring at current point in radians.
- `getHeatDirection()`: computes the direction of heating a vortex at current point in radians.
- `checkBase(expectedBase)`: checks if the current potion base is the given expected base. If not, this check produce an error.
- `getVortex(x, y)`: returns the coordinates and radius of the target vortex.
  - `x`, `y`: the rough coordinates of the target vortex (i.e. inside the vortex).
  - return: `{x:number, y:number, r:number}` be a object with `x`, `y`, `r` as keys. The center of the vortex and the radius of the vortex.
  - `getVortexC()`: the same as `getVortex` but with coordinated inputs.
  - `getVortexP()`: the same as `getVortex` but with plotter point(`import("@potionous/dataset").PlotPoint`) inputs.

### Complex subroutines.

- `straighten(direction, salt, {maxStirLength?, maxGrains?, ignoreReverse?,preStirLength?, leastSegmentLength?})`: straighten the potion path with rotation salts, i.e. automatically adding proper number of rotation salt while stirring to make the potion path straight.
  - `direction`: the direction to be stirred in radian.
  - `salt`: the type of salt to be added, it must be "moon" or "sun".
  - `maxStir`, `maxGrains`: stopping conditions of the straightening process. Default to be `Infinity`, i.e. stopping condition not set.
  - `preStir`: the amount of stirring to be added before the straightening process. Default to be `0`.
  - `ignoreReverse`: Controls the behavior when reversed direction(i.e. should add another rotation salt to bend it to the given direction) is detected. If set, no salt will be added and the process continues. If not set, the function terminate when a reversed direction is detected.
    - Default to be `true`, i.e. not set the reversed direction terminate condition.
  - **Generally you should set at least one of the 3 terminate condition.**
  - Straightening is important for many high-salt recipes with brute-force bended path.
    > Under some assumption, we can prove that that the optimal path is:.
    >
    > 1. A part of the ingredient.
    > 2. A straightened part.
    > 3. Last part of the ingredient.
    >    And there are geometric relations between the straighten direction and some other directions.

### utilities

#### getters and setters

- `getTotalMoon()`: get the total amount of moon salt added so far _in this script_.
- `getTotalSun()`: get the total amount of sun salt added so far _in this script_.
- `setVirtual()`: enter virtual mode.
- `unsetVirtual()`: exit virtual mode.
- `getRecipeItems()`: get the current recipe items based on the current mode (actual or virtual).
- `getPlot()`: get the current plot based on the current mode.
- `setDisplay(display)`: set the display mode of the plotter.
  - `display`: `true` or `false`.
- `setStirRounding(stirRounding)`: set the stir rounding mode of the plotter. This mode rounds most numbers to 3 digits after the decimal point, same as manual instructions on the online plotter.
  - `stirRounding`: `true` or `false`.
  - some operations that potentially require high precision is not rounded. For example stirring to certain target effect.
- `printSalt()`: print the current moon salt and sun salt used, since plotter scripting do not calculate it automatically.
  - All functions related to salt usage have grains as return value. This can be used to manually calculate the salt usage.

#### Vector operations

- `unitV(v)`: calculate the unit vector of a 2D vector.
  - `v`: the 2D vector.
  - `unit(x,y)`: The coordinated version.
- `vMag(v)`: compute the magnitude of a vector.
- `vSub(v1, v2)`: subtract two vectors.
- `vAdd(v1, v2)`: add two vectors.
- `vProd(v1, v2)`: compute the dot product of two vectors.
- `vRot(v, angle)`: rotate a vector by a given angle.
- `vRot90(v)`: rotate a vector by 90 degrees.
- `vNeg(v)`: negate a vector (i.e. rotate by 180 degrees).
- `vRot270(v)`: rotate a vector by 270 degrees.
- `intersectCircle(circle, point, direction)`: calculate the intersection points of a line defined by a point and direction, and a circle.
  - `circle`: `{x: number, y: number, r: number}` be a object with `x`, `y`, `r` as keys.
  - `point`: `{x: number, y: number}` be a object with `x`, `y` as keys.
  - `direction`: `{x: number, y: number}` be a object with `x`, `y` as keys.

### Constants

- `SaltAngle`: the angle of one grain of rotation salt in radian.
- `VortexRadiusLarge`, `VortexRadiusMedium`, `VortexRadiusSmall`: the radius of the vortex. The value is `2.39`, `1.99`, `1.74` respectively.
- `DeviationT2`, `DeviationT3`, `DeviationT1`: the deviation of the vortex. The value is `600`, `100`, `2754` respectively.
- `EntityVortex`, `EntityPotionEffect`, `EntityDangerZone`, `EntityStrongDangerZone`: Predefined arrays of related entity names.
- `SaltType.Moon`, `SaltType.Sun`: Predefined salt names.
- `Effects`: Predefined objects of effect positions and angles.
  - For example, `Effects.Water.Healing` stores the position and angle of the healing effect in water base.

---
