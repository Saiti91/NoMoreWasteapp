const { createRecipeSchema, updateRecipeSchema } = require("./model");
const recipeRepository = require("./repository");
const { InvalidArgumentError, UnauthorizedError } = require("../common/service_errors");
const fs = require("fs");
const path = require("path");

// Fonction de création d'une recette
async function createRecipe(recipeData) {
    // Separate file from the rest of the recipe data
    const { file, ...recipeWithoutFile } = recipeData;

    // Validate recipe data without the file field
    const { error } = createRecipeSchema.validate(recipeWithoutFile);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    // Proceed with the rest of the logic
    const { name, instructions, ingredients } = recipeWithoutFile;

    // Create the recipe and get the ID
    const recipeId = await recipeRepository.createRecipe(name, instructions);
    console.log("Created recipe with ID:", recipeId);

    // Add the ingredients to the recipe
    for (const ingredient of ingredients) {
        await recipeRepository.addIngredient(
            recipeId,
            ingredient.product_id,
            ingredient.quantity,
            ingredient.unit,
            ingredient.description
        );
    }

    // Handle the image file if it exists
    if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        const newFilename = `${recipeId}${ext}`;
        const newPath = path.join(path.dirname(file.path), newFilename);
        console.log("Renaming file to:", newPath);
        // Rename the file
        fs.renameSync(file.path, newPath);
    }

    // Return the recipe ID
    return { Recipes_ID: recipeId };
}

// Fonction de récupération d'une recette par ID
async function getRecipeById(id) {
    const recipe = await recipeRepository.getRecipeById(id);
    return recipe ? { ...recipe } : null;
}

// Fonction de récupération de toutes les recettes
async function getAllRecipes() {
    return await recipeRepository.getAllRecipes();
}

async function filterRecipesByProducts(productIds) {
    // Récupérer toutes les recettes et leurs ingrédients
    const allRecipes = await recipeRepository.getAllRecipes();

    // Filtrer les recettes réalisables avec les produits disponibles
    return allRecipes.filter(recipe =>
        recipe.Ingredients.every(ingredient =>
            productIds.includes(ingredient.Product_ID)
        )
    );
}

// Fonction de mise à jour d'une recette par ID
async function updateRecipe(id, recipeData) {
    const existingRecipe = await recipeRepository.getRecipeById(id);
    if (!existingRecipe) {
        throw new Error(`Recipe with ID ${id} does not exist`);
    }

    // Validation des données de mise à jour
    const { error } = updateRecipeSchema.validate(recipeData);
    if (error) {
        throw new InvalidArgumentError(error.details[0].message);
    }

    const { name, instructions, ingredients } = recipeData;

    // Mise à jour des informations de la recette
    await recipeRepository.updateRecipe(id, name, instructions);

    // Suppression des anciens ingrédients et ajout des nouveaux
    if (ingredients) {
        await recipeRepository.deleteIngredientsByRecipeId(id);
        for (const ingredient of ingredients) {
            await recipeRepository.addIngredient(
                id,
                ingredient.product_id,
                ingredient.quantity,
                ingredient.unit,
                ingredient.description
            );
        }
    }

    // Retour des données mises à jour
    return { Recipes_ID: id };
}

// Fonction de suppression d'une recette par ID
async function deleteRecipe(id, issuer) {
    const recipe = await recipeRepository.getRecipeById(id);
    if (!recipe) {
        throw new Error(`Recipe with ID ${id} does not exist`);
    }
    if (issuer?.role !== "admin") {
        throw new UnauthorizedError("Vous ne pouvez pas supprimer une recette sans être un administrateur.");
    }
    await recipeRepository.deleteRecipe(id);
    return { message: "Recipe deleted successfully" };
}

module.exports = { createRecipe, filterRecipesByProducts, getRecipeById, getAllRecipes, updateRecipe, deleteRecipe };
