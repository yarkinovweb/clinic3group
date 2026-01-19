const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Bazaga ulanishda xato:', err.stack);
    }
    console.log("DB ulanishda xatolik");
    release();
});

module.exports = pool;