const {createPool} = require('mysql2');
require('dotenv').config();


// prepara conexão
const pool = createPool({
	connectionLimit: 100,
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE
});

module.exports = pool;