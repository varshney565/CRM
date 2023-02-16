/**
 * This file will expose all the collections that will be present in the mongoDB database.
 */

const mongoose = require('mongoose');


/**
 * getting the user collection.
 */
const User = require('./user.model')(mongoose);
/**
 * getting the ticket collection.
 */
const Ticket = require('./ticket.model')(mongoose);

db = {};
db.mongoose = mongoose;
db.User = User;
db.Ticket = Ticket;
module.exports = db;