const { Sequelizev } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,
process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306, // Porta padrão do MySQL
    logging: false, // Desabilita os logs do Sequelize 
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database successful');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = sequelize;
