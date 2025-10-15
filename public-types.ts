declare module "@potionous/common" {
  /**
   * A point in 2D space.
   */
  export interface Point {
    /**
     * The x coordinate of the point.
     */
    x: number;

    /**
     * The y coordinate of the point.
     */
    y: number;
  }

  /**
   * Calculates the distance between two points.
   */
  export function pointDistance(p1: Point, p2: Point): number;
}

declare module "@potionous/dataset" {
  import { Point } from "@potionous/common";

  /**
   * An entity in a potion base.
   */
  export interface PotionBaseEntity {
    /**
     * The type of entity.
     */
    readonly entityType: string;

    /**
     * The x coordinate of the entity.
     */
    readonly x: number;

    /**
     * The y coordinate of the entity.
     */
    readonly y: number;
  }

  export type IngredientId = string;

  /**
   * Information about an ingredient.
   */
  export interface IngredientData {
    /**
     * The internal ID of an ingredient.
     */
    readonly id: IngredientId;

    /**
     * The english name of the ingredient.
     */
    readonly name: string;

    /**
     * The percentage of the whole path that is pre-ground.
     */
    readonly preGrindPercent: number;

    /**
     * Whether the ingredient teleports.
     */
    readonly teleports: boolean;

    /**
     * Computes the path of the ingredient given the specified grind percent.
     *
     * If no grindPercent is given, a value of 1 (100%) is used.
     */
    computePath(grindPercent?: number): Point[];

    /**
     * Computes the length of the ingredient path given the specified grind percent.
     *
     * If no grindPercent is given, a value of 1 (100%) is used.
     */
    computeLength(grindPercent?: number): number;
  }

  export const Ingredients: {
    readonly [K in IngredientId]: K;
  } & {
    /**
     * Gets the ingredient data for the given ingredient ID.
     */
    get(id: IngredientId): IngredientData;

    /**
     * Gets all ingredient data.
     */
    getAll(): IngredientData[];
  };

  export interface PotionBase {
    /**
     * The internal id of the potion base.
     */
    readonly id: string;

    /**
     * Hit test the potion base at the given point.
     *
     * If no radius is specified, the potion bottle radius is used.
     */
    hitTest(p: Point, radius?: number): PotionBaseEntity[];
  }

  export const PotionBases: {
    /**
     * Gets the current potion base.
     */
    readonly current: PotionBase;
  };
}

declare module "@potionous/instructions" {
  import { IngredientId } from "@potionous/dataset";
  /**
   * An instruction to the plotter.
   */
  export interface RecipeItem {
    /**
     * The type of the instruction.
     */
    readonly type: string;
  }

  /**
   * Adds an ingredient instruction
   * @param ingredientId The ID of the ingredient to add
   * @param grindPercent The percentage of the ingredient to grind as a decimal (0-1)
   */
  export function addIngredient(ingredientId: IngredientId, grindPercent: number): void;

  /**
   * Creates an add ingredient instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param ingredientId The ID of the ingredient to add
   * @param grindPercent The percentage of the ingredient to grind as a decimal (0-1)
   */
  export function createAddIngredient(ingredientId: IngredientId, grindPercent: number): RecipeItem;

  /** Adds an instruction for the specified rotation salt.
   * @param salt The type of rotation salt to add ("sun" or "moon")
   * @param grains The amount of salt to add in grains
   */
  export function addRotationSalt(salt: "sun" | "moon", grains: number): void;

  /** Creates an add rotation salt instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param salt The type of rotation salt to add ("sun" or "moon")
   * @param grains The amount of salt to add in grains
   */
  export function createAddRotationSalt(salt: "sun" | "moon", grains: number): RecipeItem;

  /** Adds an instruction for the specified void salt.
   * @param grains The amount of salt to add in grains
   */
  export function addSunSalt(grains: number): void;

  /** Creates an add sun salt instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param grains The amount of salt to add in grains
   */
  export function createAddSunSalt(grains: number): RecipeItem;

  /** Adds an instruction for the specified void salt.
   * @param grains The amount of salt to add in grains
   */
  export function addMoonSalt(grains: number): void;

  /** Creates an add moon salt instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param grains The amount of salt to add in grains
   */
  export function createAddMoonSalt(grains: number): RecipeItem;

  /** Adds an instruction for the specified void salt.
   * @param grains The amount of salt to add in grains
   */
  export function addVoidSalt(grains: number): void;

  /** Creates an add void salt instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param grains The amount of salt to add in grains
   */
  export function createAddVoidSalt(grains: number): RecipeItem;

  /** Adds an instruction for the specified heat vortex.
   * @param distance The distance to add in PotionCraft units
   */
  export function addHeatVortex(distance: number): void;

  /** Creates an add heat vortex instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param distance The distance to add in PotionCraft units
   */
  export function createHeatVortex(distance: number): RecipeItem;

  /** Adds an instruction for the specified pour solvent.
   * @param distance The distance to add in PotionCraft units
   */
  export function addPourSolvent(distance: number): void;

  /** Creates an add pour solvent instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param distance The distance to add in PotionCraft units
   */
  export function createPourSolvent(distance: number): RecipeItem;

  /** Adds an instruction for the specified set position.
   * @param x The x coordinate to set
   * @param y The y coordinate to set
   */
  export function addSetPosition(x: number, y: number): void;

  /** Creates an add set position instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param x The x coordinate to set
   * @param y The y coordinate to set
   */
  export function createSetPosition(x: number, y: number): RecipeItem;

  /** Adds an instruction for the specified stir cauldron.
   * @param distance The distance to add in PotionCraft units
   */
  export function addStirCauldron(distance: number): void;

  /** Creates an add stir cauldron instruction.
   *
   * This does not add the instruction to the recipe.  Instead, it returns the instruction.
   * @param distance The distance to add in PotionCraft units
   */
  export function createStirCauldron(distance: number): RecipeItem;
}

declare module "@potionous/plot" {
  import { PotionBaseEntity } from "@potionous/dataset";
  import { RecipeItem } from "@potionous/instructions";

  /**
   * A point plotted from a recipe.
   */
  export interface PlotPoint {
    /**
     * The RecipeItem used to plot this point.
     */
    readonly source: RecipeItem;

    /**
     * The x coordinate of the point.
     */
    readonly x: number;

    /**
     * The y coordinate of the point.
     */
    readonly y: number;

    /**
     * The angle of the potion at this point in degrees.
     */
    readonly angle: number;

    /**
     * The health of the potion at this point.
     */
    readonly health: number;

    /**
     * Whether this point was generated as a teleportation operation.
     * This is used to determine how hit testing operates, and generally
     * reflects if the point was created with a teleporting ingredient source.
     */
    readonly isTeleportation: boolean;

    /**
     * All entities that the bottle at this point collides with.
     */
    readonly bottleCollisions: readonly PotionBaseEntity[];
  }

  /**
   * The result of plotting a recipe.
   */
  export interface PlotResult {
    /**
     * Points that are 'committed' to the potion.
     * This includes solvent, vortexes, and the portion of ingredients that are stirred.
     */
    readonly committedPoints: readonly PlotPoint[];

    /**
     * Points that have yet to be committed to the plot.
     * This typically only ever includes unstirred ingredients.
     */
    readonly pendingPoints: readonly PlotPoint[];
  }

  /**
   * The computed plot for all instructions up to, but not including, this script.
   */
  export const startingPlot: PlotResult;

  /**
   * The recipe items for the current recipe, up to but not including this script.
   */
  export const startingRecipeItems: readonly RecipeItem[];

  /**
   * The current computed plot including all instructions added by this script.
   * This will update when any instruction is added or removed.
   */
  export const currentPlot: PlotResult;

  /**
   * The recipe items for the current recipe, including all instructions added by this script.
   * This will update when any instruction is added or removed.
   * This is the same as the recipe items in the current plot.
   */
  export const currentRecipeItems: readonly RecipeItem[];

  /**
   * Compute a plot from the given items.
   * This does not take into account any existing items in the plot, instead,
   * it creates and computes a new plot from scratch consisting of only the given items.
   */
  export function computePlot(items: readonly RecipeItem[]): PlotResult;
}
