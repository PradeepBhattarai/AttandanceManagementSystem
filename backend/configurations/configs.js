// #For Local Database 

const dotenv = require('dotenv').config()

const express_config = {

  port:process.env.PORT_NO
};
const databaseName = 'schema_attendance';
const database_config ={
  supportBigNumbers: true,
  bigNumberStrings: true,
  host:  process.env.DB_HOST,
  user:  process.env.DB_USER,
  password:  process.env.DB_PASSWORD,
  database: databaseName,
  dateStrings:true

}

module.exports.databaseConfig = database_config;
module.exports.expressConfig = express_config;



// For Online Database 
// const dotenv = require('dotenv').config();
// const mysql = require('mysql');

// const express_config = {
//   port: process.env.PORT_NO
// };

// const database_config = {
//   supportBigNumbers: true,
//   bigNumberStrings: true,
//   host:process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   dateStrings: true
// };

// // Create a connection to the database
// const connection = mysql.createConnection(database_config);

// // Attempt to establish the connection
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.message);
//     return;
//   }
//   console.log('Connected to database');
  
//   // Perform database operations here
  
//   // Close the connection when done
//   connection.end();
// });

// module.exports.databaseConfig = database_config;
// module.exports.expressConfig = express_config;
