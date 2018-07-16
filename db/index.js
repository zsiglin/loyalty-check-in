const knexfile = require('../knexfile');
const db = require('knex')(knexfile);

module.exports = db;