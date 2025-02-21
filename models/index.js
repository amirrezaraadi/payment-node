'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
require('dotenv').config();
const config = {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
};
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: false,
    });
}
const db = {};
const modelDirectories = [
    path.join(__dirname, '../cnt_modular/users/models/'),
    path.join(__dirname, '../cnt_modular/payments/models/'),
];

modelDirectories.forEach(directory => {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory)
            .filter(file => file.slice(-3) === '.js')
            .forEach(file => {
                const model = require(path.join(directory, file))(sequelize, Sequelize.DataTypes);
                db[model.name] = model;
            });
    } else {
        console.warn(`Directory not found: ${directory}`);
    }
});
Object.keys(db).forEach(modelName => {
    if (typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;