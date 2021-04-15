const mysql = require("mysql");

exports.dbConfig = () => {
    // Connecting to the db on --production mode
    if (process.env.NODE_ENV === 'production') {
        // We are running in production mode
        const db = mysql.createConnection(process.env.DATABASE_URL);
        return db;
    } else {
        // We are running in development mode
        // Connecting to the db on --development env
        const db = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DBNAME
        });
        return db;
    }

}