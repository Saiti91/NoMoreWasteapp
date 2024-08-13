const Joi = require('joi');

// Schéma de validation pour créer une catégorie
const createCategorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    diploma_id: Joi.number().integer().required() // Assurez-vous que cette valeur correspond à un diplôme valide
});

// Schéma de validation pour mettre à jour une catégorie
const updateCategorySchema = Joi.object({
    name: Joi.string().max(100).optional(),
    diploma_id: Joi.number().integer().optional() // Assurez-vous que cette valeur correspond à un diplôme valide
}).min(1);

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};