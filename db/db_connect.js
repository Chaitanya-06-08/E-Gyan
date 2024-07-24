require('dotenv').config()
const mysql2 = require("mysql2");

const conn = mysql2.createPool({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
});

module.exports = conn.promise();
