const { sequelize } = require("./dbConnection");

sequelize.sync({ alter: true }) // or { force: true } if you want to recreate
    .then(() => {
        console.log('✅ All models synced successfully.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Failed to sync models:', error);
        process.exit(1);
    });