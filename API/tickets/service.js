const { createTicketSchema, updateTicketSchema } = require('./model');
const Repository = require('./repository');
const { InvalidArgumentError, NotFoundError } = require('../common/service_errors');
const fs = require('fs');
const path = require('path');

// Fonction de création d'un ticket
async function createOne(ticket) {
    // const { value, error } = createTicketSchema.validate(ticket);
    // if (error) {
    //     throw error;
    //}
    const { file, ticketData } = ticket;
    console.log("ticket from service", ticketData);

    const newTicketId = await Repository.createOne(ticketData);

    // Gérer l'image du ticket après sa création
    if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        const newFilename = `${newTicketId}${ext}`;
        const newPath = path.join(path.dirname(file.path), newFilename);
        console.log("Renaming file to:", newPath);
        // Renommer le fichier pour inclure l'ID du ticket
        fs.renameSync(file.path, newPath);
    }

    return { ...ticket, ticket_id: newTicketId };
}

// Fonction de récupération d'un ticket en fonction de son ID
async function getOne(id) {
    const ticket = await Repository.getOne(id);
    if (!ticket) {
        throw new NotFoundError(`Ticket with ID ${id} not found.`);
    }
    return ticket;
}

// Fonction de récupération de tous les tickets
async function getAll() {
    const tickets = await Repository.getAll();
    return tickets;
}

// Fonction de mise à jour d'un ticket
async function updateOne(id, ticket) {
    const { value, error } = updateTicketSchema.validate(ticket);
    if (error) {
        throw error;
    }

    const affectedRows = await Repository.updateOne(id, value);
    if (affectedRows === 0) {
        throw new NotFoundError(`Ticket with ID ${id} not found.`);
    }

    return { ...value, ticket_id: id };
}

// Fonction de suppression d'un ticket
async function deleteOne(id) {
    const affectedRows = await Repository.deleteOne(id);
    if (affectedRows === 0) {
        throw new NotFoundError(`Ticket with ID ${id} not found.`);
    }
    return { message: `Ticket with ID ${id} has been deleted.` };
}

//Récupère tous les tickets d'un utilisateur
async function getAllForUser(userId) {
    const tickets = await Repository.getAllForUser(userId);
    if (tickets.length === 0) {
        throw new NotFoundError(`No tickets found for user ID ${userId}`);
    }
    return tickets;
}


module.exports = {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
    getAllForUser,
};
