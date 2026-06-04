// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '88.200.63.148',
    user: 'studenti',
    password: 'S039C8R7',
    database: 'SISIII2026_89241335'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected toserver.');
});

app.listen(5000, () => console.log('Backend running on port 5000'));