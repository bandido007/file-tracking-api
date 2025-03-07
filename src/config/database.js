const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize (
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect:'postgres',
        logging:process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min:0 ,
            acquire : 30000,
            idle : 10000,
        }
    }
);

// testing the connection
async function testConnection (){
    try {
        await sequelize.authenticate ();
        console.log('Database connection established successfully.');
    }   
    catch(error){
        console.error('Unable to connect to the database',error);
    }
}

// calling the function to test connection when this modeule is imported
testConnection();

module.exports = sequelize;