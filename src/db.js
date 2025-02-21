// const mysql = require('mysql');
// require('dotenv').config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database.');
// });

// module.exports = connection;

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false, 
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to MySQL via Sequelize!"))
  .catch((err) => console.error("❌ MySQL Connection Error:", err));

sequelize
  .sync({ alter: true }) 
  .then(() => console.log("✅ All models were synchronized successfully."))
  .catch((err) => console.error("❌ Sequelize Sync Error:", err));

module.exports = sequelize;

