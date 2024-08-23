const { createSkillSchema, updateSkillSchema } = require("./model");
const Repository = require("./repository");
const { InvalidArgumentError, NotFoundError } = require("../common/service_errors");
const fs = require('fs');
const path = require('path');


// Fonction de création d'une compétence
async function createOne(skill) {
    const { value, error } = createSkillSchema.validate(skill);
    if (error) {
        throw error;
    }

    // Vérifier si une compétence avec le même nom existe déjà
    if (await Repository.getOneBy("Name", value.name)) {
        throw new InvalidArgumentError("Une compétence avec ce nom existe déjà.");
    }

    return await Repository.createOne(value);
}

// Fonction de récupération d'une compétence en fonction de son ID
async function getOne(id) {
    const skill = await Repository.getOne(id);
    if (!skill) {
        throw new NotFoundError(`Compétence avec l'id ${id} non trouvée.`);
    }
    return skill;
}

// Fonction de récupération de toutes les compétences
async function getAll() {
    return await Repository.getAll();
}

// Fonction de récupération de toutes les compétences validées pour un utilisateur spécifique
async function getAllForUser(userId) {
    const userSkills = await Repository.getAllForUser(userId);
    console.log('User skills from service:', userSkills);
    console.log('User skills length:', userSkills.length);
    if (userSkills.length === 0) {
        console.error(`No skills found for user with id ${userId}. Throwing NotFoundError.`);
        throw new NotFoundError(`Aucune compétence trouvée pour l'utilisateur avec l'id ${userId}.`);
    }
    return userSkills;
}

//Fonction pour une supprimer une compétence d'un utilisateur
async function deleteSkillForUser(userId, skillId) {
    return await Repository.deleteSkillForUser(userId, skillId);
}


// Fonction de mise à jour d'une compétence en fonction de son ID
async function updateOne(id, skill) {
    const { value, error } = updateSkillSchema.validate(skill);
    if (error) {
        throw error;
    }

    const currentSkill = await Repository.getOne(id);
    if (!currentSkill) {
        throw new NotFoundError(`Compétence avec l'id ${id} non trouvée.`);
    }

    // Vérifier si une compétence avec le même nom existe déjà
    if (value.name && value.name !== currentSkill.Name) {
        const existingSkill = await Repository.getOneBy("Name", value.name);
        if (existingSkill) {
            throw new InvalidArgumentError("Une compétence avec ce nom existe déjà.");
        }
    }

    const updatedSkillData = {
        ...currentSkill,
        ...value
    };

    return await Repository.updateOne(id, updatedSkillData);
}

// Fonction de suppression d'une compétence
async function deleteOne(id) {
    const skill = await Repository.getOne(id);
    if (!skill) {
        throw new NotFoundError(`Compétence avec l'id ${id} non trouvée.`);
    }

    return await Repository.deleteOne(id);
}

//Ajouter une compétence à un utilisateur
async function addSkillForUser(userId, skillId, documentPath) {
    // Ajouter la compétence pour l'utilisateur
    const result = await Repository.addSkillForUser(userId, skillId, documentPath);
    if (!result) {
        throw new Error('Failed to add skill for user.');
    }

    return {
        message: 'Skill added successfully',
        skillId: skillId,
        documentPath: documentPath,
    };
}


module.exports = { createOne, getOne, getAll, getAllForUser, updateOne, deleteOne, deleteSkillForUser, addSkillForUser };