const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");
const itemsPool = new Pool();
module.exports = itemsPool;
