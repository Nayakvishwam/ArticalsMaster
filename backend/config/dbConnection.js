const { Sequelize } = require('sequelize');
let { development } = require("./config.json");
const { initModels } = require('../models/init-models');
const sequelize = new Sequelize(development.database, development.username, development.password, {
    host: development.host,
    dialect: development.dialect,
    logging: false,
    port: development.port,
    pool: {
        max: 5, // Limit max connections
        min: 0,
        acquire: 30000, // Wait 30s before throwing error
        idle: 10000, // Close idle connections after 10s
    },
});
async function isDBConnected() {
    try {
        const connection = await sequelize.connectionManager.getConnection();
        await sequelize.connectionManager.releaseConnection(connection);
        console.log("✅ Sequelize is connected.");
        return true;
    } catch (error) {
        console.log("❌ Sequelize is NOT connected.");
        return false;
    }
}

async function connectDB() {
    let isConnected = await isDBConnected();
    if (isConnected) {
        console.log("Sequelize is already connected to the database.");
        return sequelize;
    }

    try {
        await sequelize.authenticate();
        console.log("Database connected");
        isConnected = true;
    } catch (err) {
        console.error("Database connection error:", err);
    }

    return sequelize;
}
(async () => {
    await connectDB();
})();



const models = initModels(sequelize);
sequelize.sync({ alter: true });
module.exports = { sequelize, models };