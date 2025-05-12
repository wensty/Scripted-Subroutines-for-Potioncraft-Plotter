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
    │   someRecipe.js
    │   anotherRecipe.js
```

- `main.js` : the main scripting file.
- `public-types.ts` : containing signatures of all the APIs provided by the plotter tool. Since plotter tool itself is not fully open-source, this allows you to scripting offline with intellisense support.
- `scriptRecipes` : My recipe dataset, containing the scripts finally made online. Can be used as examples.
- `scriptRecipes/ImportScript.js` : Containing all the exported functions. Make it easier to import functions offline when storing scripts.

## How to use this collection of functions and scripted subroutines.

> Import and export on plotter is under development.
>
> Note that online plotter scripting accepts only one input file

- Copy the whole `main.js` file into the online script editor.
- Delete all the import statements _since the online plotter have not implemented this._
- Write your script recipe in the `main()` function. All the defined utility functions and subroutines can be used.

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

- `@sunset` at [PotionCraft discord](https://discord.com/channels/801182992793075743). Creator of the [potionous](https://potionous.app) app and the potionous plotter tool.

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

For the detailed use of the functions, see JSDoc.

### logged instruction

- `logAddIngredient` and similar: logged version of the instruction APIs. It print an information to console and add the instruction.

### Detection functions

Used to detection of certain entities.

- `isDangerZone`
- `isStrongDangerZone`
- `isVortex`

### Stirring subroutines.

- `stirIntoVortex`
- `StirToEdge`
- `stirToTurn`
- `StirIntoSafeZone`
- `stirToNearestTarget`
- `stirToTier`

### Pouring subroutines.

- `pourToEdge`
- `heatAndPourToEdge`
- `pourToDangerZone`
- `derotateToAngle`

### Angle conversion functions

- `degToRad`
- `radToDeg`
- `degToSalt`
- `radToSalt`
- `saltToDeg`
- `saltToRad`

### Angle and direction extractions

- `getDirectionByVector`
- `getVectorByDirection`
- `getRelativeDirection`
- `getBottlePolarAngle`
- `getBottlePolarAngleByVortex`
- `getCurrentStirDirection`
- `getCurrentPourDirection`

### Extraction of other informations.

- `checkBase`
- `getCurrentVortexRadius`
- `getCurrentTargetError`

### Checking for entities in future path.

- `checkStrongDangerZone`

### Complex subroutines.

- `straighten`

---
